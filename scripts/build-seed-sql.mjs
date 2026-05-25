import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { CATEGORIES, buildFallbackWords } from "../src/catalog.js";

const migrationsDir = resolve("migrations");
const words = buildFallbackWords();
const WORD_INSERT_CHUNK_SIZE = 20;

function sql(value) {
  return `'${String(value ?? "").replaceAll("'", "''")}'`;
}

function chunks(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function wordTuple(word) {
  return `  (${sql(word.w)}, ${sql(word.c)}, ${word.position}, ${sql(word.tag)}, ${sql(word.zh)}, ${sql(word.en)}, ${sql(word.ex)}, ${sql(word.exz)}, ${sql(JSON.stringify(word.s || []))})`;
}

function migrationName(index) {
  return `0003_seed_words_${String(index + 1).padStart(3, "0")}.sql`;
}

await mkdir(migrationsDir, { recursive: true });

for (const file of await readdir(migrationsDir)) {
  if (/^0002_seed.*\.sql$/.test(file) || /^0003_seed_words_\d+\.sql$/.test(file)) {
    await rm(resolve(migrationsDir, file));
  }
}

const resetLines = [
  "DELETE FROM words;",
  "DELETE FROM categories;",
  "",
  "INSERT INTO categories (id, label, zh, tag, sort_order, expected_count) VALUES",
  CATEGORIES.map((cat, index) => `  (${sql(cat.id)}, ${sql(cat.label)}, ${sql(cat.zh)}, ${sql(cat.tag)}, ${index + 1}, ${cat.count})`).join(",\n") + ";",
  ""
];

await writeFile(resolve(migrationsDir, "0002_seed_reset.sql"), resetLines.join("\n"), "utf8");

const groups = chunks(words, WORD_INSERT_CHUNK_SIZE);
await Promise.all(groups.map((group, index) => {
  const lines = [
    "INSERT INTO words (word, category_id, position, tag, zh, en, example_en, example_zh, synonyms) VALUES",
    group.map(wordTuple).join(",\n") + ";",
    ""
  ];
  return writeFile(resolve(migrationsDir, migrationName(index)), lines.join("\n"), "utf8");
}));

console.log(`Wrote seed migrations with ${words.length} words in ${groups.length} word files.`);
