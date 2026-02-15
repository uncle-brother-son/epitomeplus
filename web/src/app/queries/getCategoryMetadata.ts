import { client } from '@/lib/sanity/client';

export type CategoryMetadata = {
  motionTitle?: string;
  motionDescription?: string;
  motionOgImage?: { asset: { url: string } };
  stillsTitle?: string;
  stillsDescription?: string;
  stillsOgImage?: { asset: { url: string } };
};

export const CATEGORY_METADATA_QUERY = `
*[_type == "setCategoryMetadata"][0]{
  motionTitle,
  motionDescription,
  motionOgImage{ asset->{ url } },
  stillsTitle,
  stillsDescription,
  stillsOgImage{ asset->{ url } }
}
`;

export async function getCategoryMetadata(): Promise<CategoryMetadata | null> {
  return client.fetch<CategoryMetadata | null>(CATEGORY_METADATA_QUERY);
}
