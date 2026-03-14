// open-next.config.ts configured for ISR with KV + D1 caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-tag-cache";

export default defineCloudflareConfig({
	incrementalCache: kvIncrementalCache,
	tagCache: d1NextTagCache,
});
