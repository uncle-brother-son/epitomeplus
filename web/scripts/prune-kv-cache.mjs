import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

const KV_NAMESPACE_ID = "8211784f76ac4f7da7ed25078a5bcae7"; // NEXT_INC_CACHE_KV
const CHUNK_SIZE = 10000; // wrangler's kv bulk delete limit per call
const DRY_RUN = process.argv.includes("--dry-run");

const KEEP_BUILD_ID = readFileSync(".open-next/assets/BUILD_ID", "utf8").trim();

console.log(`Current build ID: ${KEEP_BUILD_ID}`);
console.log("Listing KV keys...");

const list = spawnSync(
  "npx",
  ["wrangler", "kv", "key", "list", "--namespace-id", KV_NAMESPACE_ID, "--remote"],
  { encoding: "utf8", maxBuffer: 1024 * 1024 * 512 }
);

const keepPrefix = `incremental-cache/${KEEP_BUILD_ID}/`;
const toDelete = JSON.parse(list.stdout)
  .map((k) => k.name)
  .filter((n) => n.startsWith("incremental-cache/") && !n.startsWith(keepPrefix));

if (toDelete.length === 0) {
  console.log("No stale keys to prune.");
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`[dry-run] Would prune ${toDelete.length} stale keys from previous builds.`);
  console.log("[dry-run] First 10 keys:", toDelete.slice(0, 10));
  process.exit(0);
}

console.log(`Pruning ${toDelete.length} stale keys from previous builds...`);

const workDir = mkdtempSync(join(tmpdir(), "kv-prune-"));
for (let i = 0; i < toDelete.length; i += CHUNK_SIZE) {
  const chunkPath = join(workDir, `chunk_${i}.json`);
  writeFileSync(chunkPath, JSON.stringify(toDelete.slice(i, i + CHUNK_SIZE)));
  spawnSync(
    "npx",
    ["wrangler", "kv", "bulk", "delete", "--namespace-id", KV_NAMESPACE_ID, "--remote", "--force", chunkPath],
    { stdio: "inherit" }
  );
}

rmSync(workDir, { recursive: true, force: true });
console.log(`Pruned ${toDelete.length} stale cache keys. Current build's cache left untouched.`);
