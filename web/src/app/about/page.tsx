import { getAbout } from "../queries/getAbout";
import { getSitedata } from "../queries/getSitedata";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import FadeReveal from "../components/fadeReveal";
import ScrollReveal from "../components/scrollReveal";
import { urlFor } from "@/lib/sanity/image";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getAbout();
  const sitedata = await getSitedata();
  
  if (!data) {
    return {};
  }

  const title = `${data.title} | ${sitedata?.title}`;
  const description = data.metaDescription;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/about`;
  const ogImage = data.ogImage?.asset?.url;

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

export default async function AboutPage() {
  const data = await getAbout();

  if (!data) {
    return <div>No About Page data found.</div>;
  }

  const { title, mediaType, image, video, videoCover, intro, contactList } = data;

  return (
    <main id="main-content">
      <h1 className="sr-only">{title}</h1>
      <div className="grid10_ gap-y-3 mb-10 md:mb-20">

        <ScrollReveal className="col-start-1 col-end-4 md:col-start-1 md:col-end-6">
          {mediaType === "image" && image && (
            <Image
              src={urlFor(image).width(1600).quality(75).url()}
              alt={title || "About Image"}
              width={1600}
              height={900}
              className="w-full h-auto"
              sizes="(max-width: 767px) 100vw, 50vw"
              loading="eager"
              placeholder="empty"
            />
          )}

          {mediaType === "video" && video?.asset?.url && (
            <video
              src={video.asset.url}
              title="About Video"
              controls
              controlsList="nodownload noremoteplayback"
              playsInline
              preload="metadata"
              poster={videoCover?.asset?.url}
              className="w-full h-auto"
            />
          )}
        </ScrollReveal>

        <FadeReveal className="col-start-2 col-end-4 md:col-start-7 md:col-end-10">
          <div className="sticky top-10">
            {intro?.length > 0 && (
              <PortableText value={intro} />
            )}
            {contactList?.length > 0 && (
              <ul className="mt-4">
                {contactList.map((item, idx) => (
                  <li key={idx} className="mb-2">
                    {item.contact}<br/>
                    {item.email && (
                      <a href={`mailto:${item.email}`} target="_blank" rel="noopener noreferrer">
                        {item.email}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FadeReveal>
      
      </div>
    </main>
  );
}