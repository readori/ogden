import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildFallbackWords } from "../src/catalog.js";

const DEFAULT_AUTHORIZED_DATA_PATH = "data/authorized-words.json";

export async function loadWords() {
  const dataPath = process.env.OGDEN_AUTHORIZED_DATA || DEFAULT_AUTHORIZED_DATA_PATH;
  const resolved = resolve(dataPath);
  if (!existsSync(resolved)) {
    return {
      source: "generated-fallback",
      words: buildFallbackWords()
    };
  }

  const raw = (await readFile(resolved, "utf8")).replace(/^\uFEFF/, "");
  const parsed = JSON.parse(raw);
  return {
    source: dataPath,
    words: normalizeAuthorizedData(parsed)
  };
}

export function normalizeAuthorizedData(payload) {
  const words = Array.isArray(payload)
    ? payload
    : payload.words || payload.data || payload.items || [];
  const synsDetail = payload.synsDetail || payload.syns_detail || payload.syns || payload.SYNS_DETAIL || {};

  return words.map((item, index) => {
    const word = String(item.w || item.word || "").trim();
    const category = String(item.c || item.category || item.category_id || "").trim();
    return {
      w: word,
      c: category,
      position: Number(item.position || item.index || index + 1),
      tag: String(item.tag || category.toUpperCase()),
      zh: String(item.zh || item.cn || item.translation || ""),
      en: String(item.en || item.definition || item.def || ""),
      ex: String(item.ex || item.example_en || item.example || ""),
      exz: String(item.exz || item.example_zh || item.example_cn || ""),
      s: normalizeSynonyms(word, item.s || item.synonyms || [], synsDetail)
    };
  });
}

function normalizeSynonyms(mainWord, synonyms, synsDetail) {
  if (!Array.isArray(synonyms)) return [];
  return synonyms.map((item) => {
    if (typeof item === "string") {
      const detail = synsDetail?.[mainWord]?.[item] || {};
      return {
        w: item,
        def: String(detail.def || detail.zh || ""),
        vs: String(detail.vs || ""),
        use: String(detail.use || detail.scene || "")
      };
    }
    const word = String(item.w || item.word || item.syn || "").trim();
    return {
      w: word,
      def: String(item.def || item.zh || ""),
      vs: String(item.vs || ""),
      use: String(item.use || item.scene || "")
    };
  }).filter((item) => item.w);
}
