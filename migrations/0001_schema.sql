CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  zh TEXT NOT NULL,
  tag TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  expected_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS words (
  word TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id),
  position INTEGER NOT NULL,
  tag TEXT NOT NULL,
  zh TEXT NOT NULL,
  en TEXT NOT NULL,
  example_en TEXT NOT NULL,
  example_zh TEXT NOT NULL,
  synonyms TEXT NOT NULL DEFAULT '[]',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_words_category_position
  ON words(category_id, position);

CREATE INDEX IF NOT EXISTS idx_words_word
  ON words(word);
