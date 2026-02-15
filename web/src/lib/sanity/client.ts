import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID!, // your project ID
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2025-11-29", // today's date
  useCdn: true, // Use CDN for better performance and static export compatibility
});