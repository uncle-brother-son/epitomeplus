import { client } from '@/lib/sanity/client';
import type { PortableTextBlock } from '@portabletext/types';

export type AboutPageData = {
  title: string;
  metaDescription?: string;
  ogImage?: { asset: { url: string } };
  mediaType?: 'image' | 'video';
  image?: { asset: { url: string } };
  video?: { asset: { url: string; mimeType?: string } };
  videoCover?: { asset: { url: string } };
  intro: PortableTextBlock[];
  contactList: { contact: string; email?: string }[];
};

export const ABOUT_QUERY = `
*[_type == "aboutPage"][0]{
  title,
  metaDescription,
  ogImage{ asset->{ url } },
  mediaType,
  image{ asset->{url} },
  video{ asset->{url, mimeType} },
  videoCover{ asset->{url} },
  intro,
  contactList[]{ contact, email }
}
`;

export async function getAbout(): Promise<AboutPageData> {
  const data = await client.fetch<AboutPageData>(ABOUT_QUERY);

  // ensure intro and contactList are always arrays
  return {
    ...data,
    intro: data?.intro ?? [],
    contactList: data?.contactList ?? [],
  };
}