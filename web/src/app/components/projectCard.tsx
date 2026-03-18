'use client';

import { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';

interface ProjectCardProps {
  id: string;
  slug: string;
  brand: string;
  campaign: string;
  category?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  loading?: 'eager' | 'lazy';
  priority?: boolean;
}

const ProjectCard = memo(function ProjectCard({
  id,
  slug,
  brand,
  campaign,
  category,
  mediaUrl,
  mediaType,
  loading = 'lazy',
  priority = false,
}: ProjectCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <article
      className="relative flex flex-col h-full ease-epitome"
      id={`post-${id}`}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
        {mediaType === 'video' ? (
          <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
            <video
              src={mediaUrl}
              title={`${brand} - ${campaign}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
            <Image
              src={urlFor(mediaUrl).width(600).quality(75).url()}
              alt={`${brand} ${campaign}`}
              width={600}
              height={750}
              className="absolute inset-0 w-full h-full object-cover rounded"
              sizes="(max-width: 767px) 100vw, 33vw"
              priority={priority}
              loading={priority ? undefined : loading}
              placeholder="empty"
            />
          </div>
        )}
        <Link
          href={category ? `/${category}/${slug}` : '#'}
          className="after:absolute after:inset-0 after:z-10 md:absolute md:inset-0 md:z-10"
        >
          <div
            className={`md:bg-blue/80 md:backdrop-blur-md md:text-neutral md:hover:text-neutral md:absolute md:inset-0 flex flex-col gap-1 justify-center pt-1 md:p-1 transition-opacity duration-320 ease-epitome ${
              showOverlay ? 'md:opacity-100' : 'md:opacity-0'
            }`}
          >
            <h2 className="md:flex md:justify-between">
              <span className="font-medium">{brand}</span>
              <span className="font-normal ml-1">{campaign}</span>
            </h2>
          </div>
        </Link>
    </article>
  );
});

export default ProjectCard;
