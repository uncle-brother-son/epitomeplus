import { getHomePage } from "./queries/getHomePage";
import { getLatestWork, WorkType } from "./queries/getProjects";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
  const homePageData = await getHomePage();
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
    <main className="grid5_ gap-y-10 info" role="main">
      {workItems.map((work, index) => {
        const { _id, slug, brand, campaign, category, thumbnailGroup } = work;
        const mediaUrl =
          thumbnailGroup.thumbnail === "image"
            ? thumbnailGroup.thumbnailImage?.asset.url
            : thumbnailGroup.thumbnailVideo?.asset.url;
        const tileClass = tileClasses[index] || "homeTile-1";
        
        return (
          <div key={_id} className={`${tileClass} flex flex-col gap-1 relative`}>
            <Link href={category ? `/${category}/${slug.current}` : '#'}>
              {mediaUrl && (
                thumbnailGroup.thumbnail === "video" ? (
                  <video
                    src={mediaUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <Image
                    src={mediaUrl}
                    alt={`${brand} ${campaign}`}
                    width={800}
                    height={600}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                )
              )}
              <span className="font-medium">{brand}</span>
              <span className="font-normal ml-1">{campaign}</span>
            </Link>
          </div>
        );
      })}
    </main>
  );
}
