import { MetadataData } from '../queries/getSitedata';

type OrganizationSchemaProps = {
  sitedata: MetadataData;
};

export function OrganizationSchema({ sitedata }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sitedata.title,
    description: sitedata.description,
    url: 'https://epitomeplus.com',
    ...(sitedata.ogImage?.asset?.url && {
      logo: {
        '@type': 'ImageObject',
        url: sitedata.ogImage.asset.url,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema({ sitedata }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: sitedata.title,
    description: sitedata.description,
    url: 'https://epitomeplus.com',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

type BreadcrumbSchemaProps = {
  items: Array<{ name: string; url: string }>;
};

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
