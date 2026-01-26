import { getInfoBySlug, getAllInfoPages } from "../../queries/getInfo";
import { getSitedata } from "../../queries/getSitedata";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const pages = await getAllInfoPages();
  return pages.map((page) => ({
    slug: page.slug.current,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getInfoBySlug(slug);
  const sitedata = await getSitedata();

  if (!data) {
    return {};
  }

  const title = data.title;
  const description = data.metaDescription || `${data.title} - Epitome Plus`;
  const url = `https://epitomeplus.com/info/${slug}`;
  const ogImage = sitedata?.ogImage?.asset?.url;

  return {
    title,
    description,
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

export default async function InfoPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getInfoBySlug(slug);

  if (!data) {
    notFound();
  }

  const { title, description } = data;

  return (
    <main id="main-content" className="grid5_ info" role="main">
      <h1 className="col-start-1 col-end-4 md:col-start-3 md:col-end-5 text-22 font-medium mb-3 md:mb-5">
        {title}
      </h1>
      <div className="col-start-1 col-end-4 md:col-start-3 md:col-end-5">
        {description && <PortableText value={description} />}
      </div>
    </main>
  );
}
