import { BASIC_RULES, BOOK_INFO, CATEGORIES, buildFallbackWords } from "./catalog.js";

const FALLBACK_WORDS = buildFallbackWords();
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "ogden-basic-english",
        d1: Boolean(env.DB),
        kv: Boolean(env.KV),
        time: new Date().toISOString()
      });
    }

    if (url.pathname === "/api/meta") {
      return withCache(env, ctx, "meta:v2", 3600, async () => ({
        name: "Ogden Basic English 850",
        description: "A bilingual Basic English 850-word learning handbook.",
        book: BOOK_INFO,
        categories: CATEGORIES,
        rules: BASIC_RULES,
        total: 850
      }));
    }

    if (url.pathname === "/api/rules") {
      return json({ book: BOOK_INFO, rules: BASIC_RULES });
    }

    if (url.pathname === "/api/words") {
      const cat = normalizeCategory(url.searchParams.get("cat"));
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      const limit = clampInteger(url.searchParams.get("limit"), 1, 1000, 1000);
      const cacheKey = `words:v3:${cat || "all"}:${q || "_"}:${limit}`;
      return withCache(env, ctx, cacheKey, 600, async () => ({
        words: await listWords(env, { cat, q, limit }),
        source: env.DB ? "d1" : "fallback"
      }));
    }

    if (url.pathname.startsWith("/api/word/")) {
      const word = decodeURIComponent(url.pathname.slice("/api/word/".length)).toLowerCase();
      const result = await getWord(env, word);
      return result ? json({ word: result }) : json({ error: "not_found" }, 404);
    }

    if (url.pathname === "/api/progress") {
      return handleProgress(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};

async function listWords(env, { cat, q, limit }) {
  if (env.DB) {
    try {
      const where = [];
      const params = [];
      if (cat) {
        where.push("category_id = ?");
        params.push(cat);
      }
      if (q) {
        where.push("(lower(word) LIKE ? OR lower(zh) LIKE ? OR lower(en) LIKE ? OR lower(example_en) LIKE ? OR lower(example_zh) LIKE ? OR lower(synonyms) LIKE ?)");
        const pattern = `%${q}%`;
        params.push(pattern, pattern, pattern, pattern, pattern, pattern);
      }
      params.push(limit);
      const sql = `
        SELECT word, category_id, position, tag, zh, en, example_en, example_zh, synonyms
        FROM words
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY
          CASE category_id WHEN 'op' THEN 1 WHEN 'gt' THEN 2 WHEN 'pt' THEN 3 WHEN 'qg' THEN 4 WHEN 'qo' THEN 5 ELSE 9 END,
          position
        LIMIT ?
      `;
      const { results } = await env.DB.prepare(sql).bind(...params).all();
      return results.map(fromD1Row);
    } catch (error) {
      console.warn("D1 words query failed, using fallback", error);
    }
  }

  return FALLBACK_WORDS
    .filter((item) => (!cat || item.c === cat) && matchesQuery(item, q))
    .slice(0, limit);
}

async function getWord(env, word) {
  if (env.DB) {
    try {
      const row = await env.DB.prepare(`
        SELECT word, category_id, position, tag, zh, en, example_en, example_zh, synonyms
        FROM words
        WHERE lower(word) = ?
      `).bind(word).first();
      if (row) return fromD1Row(row);
    } catch (error) {
      console.warn("D1 word query failed, using fallback", error);
    }
  }
  return FALLBACK_WORDS.find((item) => item.w.toLowerCase() === word) || null;
}

function fromD1Row(row) {
  return {
    w: row.word,
    c: row.category_id,
    position: row.position,
    tag: row.tag,
    zh: row.zh,
    en: row.en,
    ex: row.example_en,
    exz: row.example_zh,
    s: normalizeSynonyms(row.word, parseJsonArray(row.synonyms))
  };
}

function matchesQuery(item, q) {
  if (!q) return true;
  return [
    item.w,
    item.zh,
    item.en,
    item.ex,
    item.exz,
    ...(item.s || []).flatMap((synonym) => typeof synonym === "string"
      ? [synonym]
      : [synonym.w, synonym.def, synonym.vs, synonym.use])
  ].join(" ").toLowerCase().includes(q);
}

async function handleProgress(request, env) {
  if (!env.KV) return json({ learned: [] });

  const uid = getUid(request) || crypto.randomUUID();
  const key = `progress:${uid}`;
  const cookie = `ogden_uid=${uid}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;

  if (request.method === "GET") {
    const learned = parseJsonArray(await env.KV.get(key));
    return json({ learned }, 200, { "set-cookie": cookie });
  }

  if (request.method === "PUT" || request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const learned = Array.isArray(body.learned)
      ? body.learned.map(String).slice(0, 1000)
      : [];
    await env.KV.put(key, JSON.stringify(learned), { expirationTtl: 60 * 60 * 24 * 365 });
    return json({ learned }, 200, { "set-cookie": cookie });
  }

  return json({ error: "method_not_allowed" }, 405, { allow: "GET, PUT, POST" });
}

async function withCache(env, ctx, key, ttl, producer) {
  if (env.KV) {
    const cached = await env.KV.get(`cache:${key}`);
    if (cached) {
      return new Response(cached, {
        headers: {
          "content-type": "application/json; charset=utf-8",
          "cache-control": `public, max-age=${Math.min(ttl, 300)}`
        }
      });
    }
  }
  const payload = await producer();
  const body = JSON.stringify(payload);
  if (env.KV) {
    ctx.waitUntil(env.KV.put(`cache:${key}`, body, { expirationTtl: ttl }));
  }
  return new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=${Math.min(ttl, 300)}`
    }
  });
}

function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function normalizeCategory(cat) {
  return CATEGORIES.some((item) => item.id === cat) ? cat : "";
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeSynonyms(main, synonyms) {
  return synonyms.map((item) => {
    if (typeof item === "string") {
      return {
        w: item,
        def: `${item}: related extension word`,
        vs: `Compare ${item} with ${main} to see the difference in use.`,
        use: `Use ${item} in a short sentence near ${main}.`
      };
    }
    return {
      w: String(item?.w || item?.word || ""),
      def: String(item?.def || item?.zh || ""),
      vs: String(item?.vs || ""),
      use: String(item?.use || "")
    };
  }).filter((item) => item.w);
}

function getUid(request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)ogden_uid=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}
