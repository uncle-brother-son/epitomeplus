// src/app/motion/[slug]/page.tsx
import { getWorkBySlug, type WorkType } from "../../queries/getProjects";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import Carousel from "../../components/carousel";
import VideoGrid from "../../components/videoGrid";

type PageProps = { params: Promise<{ slug: string }> };

export default async function WorkPostPage({ params }: PageProps) {
  const { slug } = await params; // ✅ await the params Promise
  console.log("Resolved slug:", slug);

  const work: WorkType | null = await getWorkBySlug(slug);
  console.log("Fetched work:", work);

  if (!work) return <div>Post not found</div>;

  const {
    brand,
    campaign,
    category,
    intro,
    services,
    layout,
    gridColumns,
    gridColumnsMotion,
    images,
    videos,
  } = work;

  // Derive gallery type from category
  const galleryType = category === 'stills' ? 'image' : 'video';
  // Use appropriate gridColumns based on category (with fallback to gridColumns for backwards compatibility)
  const columns = category === 'motion' ? (gridColumnsMotion || gridColumns) : gridColumns;

  return (
    <main>
        <article className="grid5_">
        <header className="col-start-1 col-end-4 md:col-end-6 mb-3 md:mb-5">
            <h1 className="text-22 font-medium">{brand}<span className="font-normal ml-2">{campaign}</span></h1> 
        </header>

        {intro?.length ? (
            <section className="col-start-1 col-end-4 md:col-start-1 md:col-end-3 mb-3 md:mb-10">
            <PortableText value={intro} />
            </section>
        ) : null}

        {category && (
            <section className="col-start-1 col-end-4 md:col-start-4 md:col-end-5 mb-3 md:mb-10">
                <Link href={`/${category}`}>{category === 'motion' ? 'Motion' : 'Stills'}</Link>
            </section>
        )}

        {services?.length ? (
            <section className="col-start-1 col-end-4 md:col-start-5 md:col-end-6 mb-10 md:mb-10">
            <PortableText value={services} />
            </section>
        ) : null}

        {(images?.length || videos?.length) && (
            <section className="col-start-1 col-end-4 md:col-end-6 mb-10 ">
              {/* Carousel layout */}
              {layout === 'carousel' && galleryType === 'image' && images && (
                <Carousel images={images} type="image" brand={brand} campaign={campaign} />
              )}
              {layout === 'carousel' && galleryType === 'video' && videos && (
                <Carousel videos={videos} type="video" brand={brand} campaign={campaign} />
              )}
              
              {/* Grid layout */}
              {layout === 'grid' && (
                <>
                  {galleryType === 'image' && images && columns && (
                    <div className={`grid gap-1 ${columns === 1 ? 'grid-cols-1 md:grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                      {images.map((img, idx) => (
                        <Image
                          key={idx}
                          src={img.asset.url}
                          alt={`${brand} ${campaign} Gallery Image ${idx + 1}`}
                          width={500}
                          height={500}
                          className="w-full object-cover rounded"
                          sizes={`(max-width: 900px) ${columns === 1 ? '100vw' : '50vw'}, ${columns === 1 ? '100vw' : columns === 2 ? '50vw' : columns === 3 ? '33vw' : '25vw'}`}
                          loading={idx < (columns || 4) ? "eager" : "lazy"}
                        />
                      ))}
                    </div>
                  )}
                  {galleryType === 'video' && videos && columns && (
                    <VideoGrid videos={videos} gridColumns={columns} />
                  )}
                </>
              )}
            </section>
        )}
        </article>
        
        <section className="grid5_ mb-10">
            <div className="col-start-1 col-end-4 md:col-end-6 flex gap-4 justify-center">
                {work.prev ? (
                    <Link href={`/motion/${work.prev.slug.current}`}>Previous Project</Link>
                ) : null}
                {work.next ? (
                    <Link href={`/motion/${work.next.slug.current}`}>Next Project</Link>
                ) : null}
            </div>
        </section>

        {category && (
            <section className="grid5_">
                <div className="col-start-1 col-end-4 md:col-end-6 flex gap-4 justify-center">
                    <Link href={`/${category}`}>All {category === 'motion' ? 'Motion' : 'Stills'} Projects</Link>
                </div>
            </section>
        )}
    </main>
  );
}