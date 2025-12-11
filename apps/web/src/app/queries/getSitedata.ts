import { client } from "../lib/sanityClient";

export type MetadataData = {
  title: string;
  description: string;
  ogImage?: { asset: { url: string } };
  favicon?: { asset: { url: string } };
};

export async function getSitedata(): Promise<MetadataData> {
  const data = await client.fetch<MetadataData>(
    `*[_type == "setSitedata"][0]{ title, description, ogImage{ asset->{ url } }, favicon{ asset->{ url } } }`
  );

  if (!data) {
    throw new Error("No metadata document found in Sanity.");
  }

  return data;
}