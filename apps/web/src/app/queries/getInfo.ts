import { client } from "../lib/sanityClient";
import type { PortableTextBlock } from "@portabletext/types";

export type InfoPageType = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: PortableTextBlock[];
};

export async function getInfoBySlug(slug: string): Promise<InfoPageType | null> {
  const query = `
    *[_type == "infoPage" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description
    }
  `;
  return client.fetch<InfoPageType | null>(query, { slug });
}

export async function getAllInfoPages(): Promise<InfoPageType[]> {
  const query = `
    *[_type == "infoPage"] | order(title asc){
      _id,
      title,
      slug,
      description
    }
  `;
  return client.fetch<InfoPageType[]>(query);
}
