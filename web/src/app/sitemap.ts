import { MetadataRoute } from 'next';
import { getAllWorkPaths } from './queries/getProjects';
import { getAllInfoPages } from './queries/getInfo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://epitomeplus.co.uk';

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workPaths, infoPages] = await Promise.all([
    getAllWorkPaths(),
    getAllInfoPages(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/motion`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/stills`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = workPaths
    .filter(({ category }) => category === 'motion' || category === 'stills')
    .map(({ slug, category }) => ({
      url: `${BASE_URL}/${category}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const infoRoutes: MetadataRoute.Sitemap = infoPages.map((page) => ({
    url: `${BASE_URL}/info/${page.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...projectRoutes, ...infoRoutes];
}
