import { getAbout } from "../queries/getAbout";
import Image from "next/image";
import { PortableText } from "next-sanity";
import FadeReveal from "../components/fadeReveal";
import ScrollReveal from "../components/scrollReveal";

export default async function AboutPage() {
  const data = await getAbout();

  if (!data) {
    return <div>No About Page data found.</div>;
  }

  const { title, mediaType, image, video, videoCover, intro, contactList } = data;

  return (
    <main>
      <div className="grid10_ gap-y-3 mb-10 md:mb-20">

        <ScrollReveal className="col-start-1 col-end-4 md:col-start-1 md:col-end-6">
          {mediaType === "image" && image?.asset?.url && (
            <Image
              src={image.asset.url}
              alt={title || "About Image"}
              width={1600}
              height={900}
              className="w-full h-auto"
              sizes="(max-width: 640px) 100vw, (max-width: 900px) 80vw, 60vw"
              loading="eager"
            />
          )}

          {mediaType === "video" && video?.asset?.url && (
            <video
              src={video.asset.url}
              controls
              controlsList="nodownload noremoteplayback"
              playsInline
              preload="auto"
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
                      <a href={`mailto:${item.email}`} target="_blank">
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