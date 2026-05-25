DELETE FROM words;
DELETE FROM categories;

INSERT INTO categories (id, label, zh, tag, sort_order, expected_count) VALUES
  ('op', 'Operations', '操作词 · 动词、介词、代词、连词等', 'OP', 1, 100),
  ('gt', 'General Things', '一般事物 · 抽象名词', 'GT', 2, 400),
  ('pt', 'Picturable Things', '可画名词 · 具体可视的事物', 'PT', 3, 200),
  ('qg', 'Qualities — General', '一般性质 · 形容词', 'QG', 4, 100),
  ('qo', 'Qualities — Opposites', '对立性质 · 反义形容词', 'OPP', 5, 50);
