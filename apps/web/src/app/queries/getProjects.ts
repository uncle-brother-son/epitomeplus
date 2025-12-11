// src/queries/getWork.ts
import { client } from "../lib/sanityClient";
import type { PortableTextBlock } from "@portabletext/types";

export type WorkType = {
  _id: string;
  slug: { current: string };
  brand: string;
  campaign: string;
  published?: boolean;
  category?: "stills" | "motion";
  thumbnailGroup: {
    thumbnail: "image" | "video";
    thumbnailImage?: { asset: { url: string } };
    thumbnailVideo?: { asset: { url: string } };
    videoCover?: { asset: { url: string } };
  };
  intro?: PortableTextBlock[];
  services?: PortableTextBlock[];
  layout?: string;
  gridColumns?: number;
  gridColumnsMotion?: number;
  images?: { asset: { url: string } }[];
  videos?: Array<
    | { file: { asset: { url: string; mimeType?: string } }; caption?: string }
    | { asset: { url: string; mimeType?: string } }
  >;
  next?: {
    slug: { current: string };
    brand?: string;
    campaign?: string;
  } | null;

  prev?: {
    slug: { current: string };
    brand?: string;
    campaign?: string;
  } | null;
};

/**
 * Fetch all project items in a category
 */
export async function getAllWorkByCategory(category: string): Promise<WorkType[]> {
  const query = `
    *[_type == "workType" && category == $category && published == true] | order(_createdAt desc){
      _id,
      slug,
      brand,
      campaign,
      category,
      thumbnailGroup{
        thumbnail,
        thumbnailImage{asset->{url}},
        thumbnailVideo{asset->{url}},
        videoCover{asset->{url}}
      },
      intro,
      services,
      layout,
      gridColumns,
      images[]{ asset->{url} },
      videos[]{ file{ asset->{url, mimeType} }, caption, asset->{url, mimeType} }
    }
  `;
  return client.fetch<WorkType[]>(query, { category });
}

/**
 * Fetch the latest project items (limited count)
 */
export async function getLatestWork(limit: number = 6): Promise<WorkType[]> {
  const query = `
    *[_type == "workType" && published == true] | order(_createdAt desc)[0...$limit]{
      _id,
      slug,
      brand,
      campaign,
      category,
      thumbnailGroup{
        thumbnail,
        thumbnailImage{asset->{url}},
        thumbnailVideo{asset->{url}},
        videoCover{asset->{url}}
      },
      intro,
      services,
      layout,
      gridColumns,
      images[]{ asset->{url} },
      videos[]{ file{ asset->{url, mimeType} }, caption, asset->{url, mimeType} }
    }
  `;
  return client.fetch<WorkType[]>(query, { limit: limit - 1 });
}

/**
 * Fetch a single project item by slug
 */
export async function getWorkBySlug(slug: string): Promise<WorkType | null> {
  const query = `
    *[_type == "workType" && slug.current == $slug][0]{
      _id,
      slug,
      brand,
      campaign,
      category,
      thumbnailGroup{
        thumbnail,
        thumbnailImage{asset->{url}},
        thumbnailVideo{asset->{url}},
        videoCover{asset->{url}}
      },
      intro,
      services,
      layout,
      gridColumns,
      images[]{ asset->{url} },
      videos[]{ file{ asset->{url, mimeType} }, caption, asset->{url, mimeType} },
      "next": *[
        _type == "workType" &&
        category == ^.category &&
        published == true &&
        _createdAt > ^._createdAt
      ] | order(_createdAt asc)[0]{
        slug,
        brand,
        campaign
      },
      "prev": *[
        _type == "workType" &&
        category == ^.category &&
        published == true &&
        _createdAt < ^._createdAt
      ] | order(_createdAt desc)[0]{
        slug,
        brand,
        campaign
      }
    }
  `;
  return client.fetch<WorkType | null>(query, { slug });
}