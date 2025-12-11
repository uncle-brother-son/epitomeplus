import { getInfoBySlug, getAllInfoPages } from "../../queries/getInfo";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pages = await getAllInfoPages();
  return pages.map((page) => ({
    slug: page.slug.current,
  }));
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getInfoBySlug(slug);

  if (!data) {
    notFound();
  }

  const { title, description } = data;

  return (
    <main className="grid5_ info" role="main">
      <h1 className="col-start-1 col-end-4 md:col-start-3 md:col-end-5 text-22 font-medium mb-3 md:mb-5">
        {title}
      </h1>
      <div className="col-start-1 col-end-4 md:col-start-3 md:col-end-5">
        {description && <PortableText value={description} />}
      </div>
    </main>
  );
}
