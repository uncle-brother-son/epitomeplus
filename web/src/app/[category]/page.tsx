// src/app/[category]/page.tsx
import { getAllWorkByCategory, WorkType } from "../queries/getProjects";
import { getSitedata } from "../queries/getSitedata";
import ProjectCard from "../components/projectCard";
import ScrollReveal from "../components/scrollReveal";
import FadeReveal from "../components/fadeReveal";
import { notFound } from "next/navigation";
import { getCategoryMetadata } from "../queries/getCategoryMetadata";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  return [
    { category: 'motion' },
    { category: 'stills' },
  ];
}

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  
  if (category !== 'motion' && category !== 'stills') {
    return {};
  }

  const metadata = await getCategoryMetadata();
  const sitedata = await getSitedata();
  
  const pageTitle = category === 'motion' 
    ? (metadata?.motionTitle)
    : (metadata?.stillsTitle);
  
  const title = `${pageTitle} | ${sitedata?.title}`;
    
  const description = category === 'motion'
    ? (metadata?.motionDescription)
    : (metadata?.stillsDescription);
    
  const ogImage = category === 'motion'
    ? (metadata?.motionOgImage?.asset?.url || sitedata.ogImage?.asset?.url)
    : (metadata?.stillsOgImage?.asset?.url || sitedata.ogImage?.asset?.url);
    
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${category}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      ...(ogImage && {
        images: [{
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  
  // Validate category
  if (category !== 'motion' && category !== 'stills') {
    notFound();
  }

  const workItems: WorkType[] = await getAllWorkByCategory(category);
  const title = category === 'motion' ? 'Motion Projects' : 'Stills Projects';

  return (
    <main id="main-content">
      <FadeReveal className="flex flex-row gap-2 mx-2 mb-10">
        <h1>{title}</h1>
      </FadeReveal>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-y-5 md:gap-1 mx-2">
        {workItems.map((work, index) => {
          const { _id, slug, brand, campaign, category, thumbnailGroup } = work;
          const mediaUrl =
            thumbnailGroup.thumbnail === "image"
              ? thumbnailGroup.thumbnailImage?.asset.url
              : thumbnailGroup.thumbnailVideo?.asset.url;
          
          if (!mediaUrl) return null;

          return (
            <ScrollReveal key={_id}>
              <ProjectCard
                id={_id}
                slug={slug.current}
                brand={brand}
                campaign={campaign}
                category={category}
                mediaUrl={mediaUrl}
                mediaType={thumbnailGroup.thumbnail}
                loading={index < 3 ? "eager" : "lazy"}
              />
            </ScrollReveal>
          );
        })}
      </ul>
    </main>
  );
}
