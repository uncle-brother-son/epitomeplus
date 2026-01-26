// src/app/[category]/page.tsx
import { getAllWorkByCategory, WorkType } from "../queries/getProjects";
import ProjectCard from "../components/projectCard";
import ScrollReveal from "../components/scrollReveal";
import FadeReveal from "../components/fadeReveal";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return [
    { category: 'motion' },
    { category: 'stills' }
  ];
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
    <main>
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
