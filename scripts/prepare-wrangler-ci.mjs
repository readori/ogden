import { readFile, writeFile } from "node:fs/promises";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

function readRequired(name) {
  const value = (process.env[name] || "").trim();
  if (!value) {
    console.error(`Missing required environment value: ${name}`);
    process.exit(1);
  }
  return value;
}

function readUuid(name) {
  const value = readRequired(name);
  const match = value.match(UUID_RE);
  if (!match) {
    console.error(`${name} must contain the D1 database UUID, not the database name.`);
    console.error("Use the database_id value from `wrangler d1 create ogden_basic_english` or `wrangler d1 list`.");
    process.exit(1);
  }
  return match[0];
}

const kvNamespaceId = readRequired("CLOUDFLARE_KV_NAMESPACE_ID");

const replacements = {
  "replace-with-cloudflare-d1-database-id": readUuid("CLOUDFLARE_D1_DATABASE_ID"),
  "replace-with-cloudflare-kv-namespace-id": kvNamespaceId,
  "replace-with-cloudflare-kv-preview-namespace-id": (process.env.CLOUDFLARE_KV_PREVIEW_NAMESPACE_ID || kvNamespaceId).trim()
};

let config = await readFile("wrangler.toml", "utf8");

for (const [placeholder, value] of Object.entries(replacements)) {
  config = config.replaceAll(placeholder, value);
}

await writeFile("wrangler.toml", config, "utf8");
console.log("Prepared wrangler.toml for CI deployment.");
