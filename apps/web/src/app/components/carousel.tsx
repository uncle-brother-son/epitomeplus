'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images?: { asset: { url: string } }[];
  videos?: Array<
    | { file: { asset: { url: string } }; caption?: string }
    | { asset: { url: string } }
  >;
  type: 'image' | 'video';
  brand?: string;
  campaign?: string;
}

export default function Carousel({ images, videos, type, brand, campaign }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const items = type === 'image' ? images : videos;
  const slideCount = items?.length || 0;

  // Matches Alpine.js right() function
  const goToNext = () => {
    if (currentSlide < slideCount - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(0);
    }
  };

  // Matches Alpine.js left() function
  const goToPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else {
      setCurrentSlide(slideCount - 1);
    }
  };

  if (!items || slideCount === 0) return null;

  return (
    <div className="w-full">
      <ul className="flex justify-center w-full transition-transform ease-linear transform-gpu overflow-hidden min-h-[274px] sm:min-h-[358px] md:min-h-[588px] lg:min-h-[702px] xl:min-h-[1062px] relative">
        {type === 'image' && images?.map((img, idx) => (
          <li
            key={idx}
            className="carouselItem absolute inset-0 flex justify-center"
            style={{ opacity: idx === currentSlide ? 1 : 0, pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
          >
            <Image
              src={img.asset.url}
              alt={`${brand} ${campaign} Gallery Image ${idx + 1}`}
              width={1500}
              height={1500}
              priority={idx === 0}
              quality={90}
              className="h-full w-auto object-contain"
              sizes="100vw"
            />
          </li>
        ))}
        {type === 'video' && videos?.map((video, idx) => {
          const videoUrl = 'file' in video && video.file?.asset?.url 
            ? video.file.asset.url 
            : 'asset' in video && video.asset?.url 
            ? video.asset.url 
            : null;
          const caption = 'caption' in video ? video.caption : undefined;
          
          if (!videoUrl) return null;
          
          return (
            <li
              key={idx}
              className="carouselItem absolute inset-0 flex justify-center flex-col"
              style={{ opacity: idx === currentSlide ? 1 : 0, pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
            >
              <video
                src={videoUrl}
                controls
                controlsList="nodownload noremoteplayback"
                playsInline
                className="h-full w-auto"
              />
              {caption && (
                <p className="text-center text-sm mt-2">{caption}</p>
              )}
            </li>
          );
        })}
      </ul>
      
      <div className="w-full flex flex-row gap-4 justify-center items-center mt-3">
        <button onClick={goToPrev} aria-label="Previous slide">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11.921H22V13.3741H4V11.921Z" fill="#333333" />
            <path d="M3.5422 11.619L7.78484 15.8616L6.75732 16.8892L2.51468 12.6465L3.5422 11.619Z" fill="#333333" />
            <path d="M2.51468 12.6465L6.75729 8.40384L7.78259 9.42915L3.53996 13.6718L2.51468 12.6465Z" fill="#333333" />
          </svg>
        </button>
        <div>
          <span>{currentSlide + 1}</span> / <span>{slideCount}</span>
        </div>
        <button onClick={goToNext} aria-label="Next slide">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 13.8573H2V12.4042H20V13.8573Z" fill="#333333" />
            <path d="M20.4578 14.1593L16.2152 9.91667L17.2427 8.88916L21.4853 13.1318L20.4578 14.1593Z" fill="#333333" />
            <path d="M21.4853 13.1318L17.2427 17.3745L16.2174 16.3492L20.46 12.1065L21.4853 13.1318Z" fill="#333333" />
          </svg>
        </button>
      </div>
    </div>
  );
}
