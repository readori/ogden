import { CATEGORIES, buildFallbackWords } from "../src/catalog.js";

const words = buildFallbackWords();
const expectedTotal = CATEGORIES.reduce((sum, category) => sum + category.count, 0);
const errors = [];

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

console.log(`Verified ${words.length} words across ${CATEGORIES.length} categories.`);
