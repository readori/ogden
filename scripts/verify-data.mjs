import { CATEGORIES } from "../src/catalog.js";
import { PUBLIC_ENRICHMENT } from "../src/enrichment.js";
import { loadWords } from "./word-source.mjs";

const { source, words } = await loadWords();
const expectedTotal = CATEGORIES.reduce((sum, category) => sum + category.count, 0);
const errors = [];
const enrichedWords = new Set(Object.keys(PUBLIC_ENRICHMENT));

if (words.length !== expectedTotal) {
  errors.push(`Expected ${expectedTotal} words, got ${words.length}.`);
}

for (const category of CATEGORIES) {
  const actual = words.filter((word) => word.c === category.id).length;
  if (actual !== category.count) {
    errors.push(`${category.id}: expected ${category.count}, got ${actual}.`);
  }
}

const duplicates = words
  .map((word) => word.w.toLowerCase())
  .filter((word, index, all) => all.indexOf(word) !== index);

if (duplicates.length) {
  errors.push(`Duplicate words: ${[...new Set(duplicates)].join(", ")}.`);
}

for (const word of words) {
  if (!word.ex || !word.exz) {
    errors.push(`${word.w}: missing bilingual example.`);
  }
  if (!Array.isArray(word.s) || !word.s.length) {
    errors.push(`${word.w}: missing extension words.`);
    continue;
  }
  for (const synonym of word.s) {
    if (!synonym.w || !synonym.def || !synonym.vs || !synonym.use) {
      errors.push(`${word.w}: extension word is missing w/def/vs/use.`);
      break;
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const enrichedCount = words.filter((word) => enrichedWords.has(word.w)).length;
console.log(`Verified ${words.length} words across ${CATEGORIES.length} categories from ${source}.`);
console.log(`Public original enrichment coverage: ${enrichedCount}/${words.length} words.`);
