// open-next.config.ts configured for ISR with KV caching
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: kvIncrementalCache,
});
