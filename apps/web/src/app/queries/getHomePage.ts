// src/queries/getHomePage.ts
import { client } from "../lib/sanityClient";
import type { WorkType } from "./getProjects";

export type HomePageType = {
  title?: string;
  intro?: string;
  featuredProjects?: WorkType[];
};

export async function getHomePage(): Promise<HomePageType | null> {
  const query = `
    *[_type == "homePage"][0]{
      title,
      intro,
      "featuredProjects": featuredProjects[]-> {
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
        }
      }
    }
  `;
  return client.fetch<HomePageType | null>(query, {}, { 
    cache: 'no-store',
    next: { revalidate: 0 } 
  });
}
