import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_API_PROJECT_ID!, // your project ID
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2025-11-29", // today's date
  useCdn: false,
});