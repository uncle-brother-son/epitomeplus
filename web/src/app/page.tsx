import { getHomePage } from "./queries/getHomePage";
import { getLatestWork, WorkType } from "./queries/getProjects";
import { getSitedata } from "./queries/getSitedata";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./components/scrollReveal";
import { urlFor } from "@/lib/sanity/image";
import type { Metadata } from "next";

export const revalidate = false;

export async function generateMetadata(): Promise<Metadata> {
  const sitedata = await getSitedata();
  
  const title = sitedata?.title;
  const description = sitedata?.description;
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  const ogImage = sitedata?.ogImage?.asset?.url;

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

export default async function Page() {
  const homePageData = await getHomePage();
  const sitedata = await getSitedata();
  // Use featured projects from homepage, or fallback to latest 6 posts
  const workItems: WorkType[] = homePageData?.featuredProjects && homePageData.featuredProjects.length > 0 
    ? homePageData.featuredProjects 
    : await getLatestWork(6);
  
  const tileClasses = [
    "homeTile-1",
    "homeTile-2",
    "homeTile-3",
    "homeTile-4",
    "homeTile-5",
    "homeTile-6"
  ];

  return (
    <main id="main-content" className="grid5_ gap-y-10 info" role="main">
      <h1 className="sr-only">{sitedata.title}</h1>
      {workItems.map((work, index) => {
        const { _id, slug, brand, campaign, category, thumbnailGroup } = work;
        const tileClass = tileClasses[index] || "homeTile-1";
        
        return (
          <ScrollReveal 
            key={`${_id}-${index}`} 
            className={`${tileClass} flex flex-col gap-1 relative`}
          >
            {thumbnailGroup.thumbnail === "video" && (thumbnailGroup.thumbnailVideoHomepage?.asset.url || thumbnailGroup.thumbnailVideo?.asset.url) ? (
                <video
                  src={thumbnailGroup.thumbnailVideoHomepage?.asset.url || thumbnailGroup.thumbnailVideo?.asset.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="rounded"
                />
              ) : thumbnailGroup.thumbnailImage && (
                <Image
                  src={urlFor(thumbnailGroup.thumbnailImage).width(1000).quality(75).url()}
                  alt={`${brand} ${campaign}`}
                  width={800}
                  height={600}
                  sizes="(max-width: 767px) 100vw, 40vw"
                  loading={index < 2 ? "eager" : "lazy"}
                  placeholder="empty"
                  className="rounded"
                />
              )
            }
            <Link href={category ? `/${category}/${slug.current}` : '#'}>
              <span className="font-medium">{brand}</span>
              <span className="font-normal ml-1">{campaign}</span>
            </Link>
          </ScrollReveal>
        );
      })}
    </main>
  );
}
