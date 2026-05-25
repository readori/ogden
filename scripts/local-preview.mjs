import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { APP_VERSION, BASIC_RULES, BOOK_INFO, CATEGORIES, buildFallbackWords } from "../src/catalog.js";

const port = Number(process.env.PORT || 8787);
const root = join(process.cwd(), "public");
const words = buildFallbackWords();

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function json(res, payload, status = 200) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(body);
}

function matches(item, q) {
  if (!q) return true;
  return [item.w, item.zh, item.en, item.ex, item.exz, ...(item.s || [])]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);

  if (url.pathname === "/api/health") {
    json(res, { ok: true, service: "ogden-local-preview", version: APP_VERSION, d1: false, kv: false });
    return;
  }

  if (url.pathname === "/api/meta") {
    json(res, { name: "Ogden Basic English 850", version: APP_VERSION, book: BOOK_INFO, categories: CATEGORIES, rules: BASIC_RULES, total: 850 });
    return;
  }

  if (url.pathname === "/api/rules") {
    json(res, { book: BOOK_INFO, rules: BASIC_RULES });
    return;
  }

  if (url.pathname === "/api/words") {
    const cat = url.searchParams.get("cat") || "";
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const limit = Math.min(1000, Math.max(1, Number(url.searchParams.get("limit") || 1000)));
    json(res, {
      source: "local-preview",
      words: words.filter((word) => (!cat || word.c === cat) && matches(word, q)).slice(0, limit)
    });
    return;
  }

  if (url.pathname === "/api/progress") {
    json(res, { learned: [] });
    return;
  }

  const safePath = normalize(url.pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, safePath === "/" ? "index.html" : safePath);
  try {
    const body = await readFile(filePath);
    res.writeHead(200, { "content-type": types[extname(filePath)] || "application/octet-stream" });
    res.end(body);
  } catch {
    const body = await readFile(join(root, "index.html"));
    res.writeHead(200, { "content-type": types[".html"] });
    res.end(body);
  }
}).listen(port, () => {
  if (process.stdout.isTTY) {
    console.log(`Local preview: http://localhost:${port}`);
  }
});
