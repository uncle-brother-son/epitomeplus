import { memo } from 'react';
import { MetadataData } from '../queries/getSitedata';

type OrganizationSchemaProps = {
  sitedata: MetadataData;
};

export const OrganizationSchema = memo(function OrganizationSchema({ sitedata }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sitedata.title,
    description: sitedata.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.epitomeplus.co.uk',
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
});

export const WebSiteSchema = memo(function WebSiteSchema({ sitedata }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: sitedata.title,
    description: sitedata.description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.epitomeplus.co.uk',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
});

type BreadcrumbSchemaProps = {
  items: Array<{ name: string; url: string }>;
};

export const BreadcrumbSchema = memo(function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
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
});
