import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: false, // Disable CDN for instant updates (ISR handles caching)
  perspective: 'published', // Only show published content
  fetch: { cache: 'no-store' }, // Always fetch fresh from Sanity, never use Next.js build-time fetch cache
});