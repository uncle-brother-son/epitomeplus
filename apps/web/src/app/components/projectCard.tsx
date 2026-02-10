'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  slug: string;
  brand: string;
  campaign: string;
  category?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  loading?: 'eager' | 'lazy';
}

export default function ProjectCard({
  id,
  slug,
  brand,
  campaign,
  category,
  mediaUrl,
  mediaType,
  loading = 'lazy',
}: ProjectCardProps) {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <li
      className="ease-epitome"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <article className="relative flex flex-col h-full" id={`post-${id}`}>
        {mediaType === 'video' ? (
          <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
            <Image
              src={mediaUrl}
              alt={`${brand} ${campaign}`}
              width={1000}
              height={1000}
              className="absolute inset-0 w-full h-full object-cover rounded"
              sizes="(max-width: 640px) 50vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
              quality={80}
              loading={loading}
            />
          </div>
        )}
        <Link
          href={category ? `/${category}/${slug}` : '#'}
          className="after:absolute after:inset-0 after:z-10 md:absolute md:inset-0 md:z-10"
        >
          <div
            className={`md:bg-blue/80 md:backdrop-blur-md md:text-white/100 md:hover:text-white/100 md:absolute md:inset-0 flex flex-col gap-1 justify-center pt-1 md:p-1 transition-opacity duration-320 ease-epitome ${
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
    </li>
  );
}
