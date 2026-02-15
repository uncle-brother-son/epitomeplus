'use client';

import ScrollReveal from './scrollReveal';

interface VideoGridProps {
  videos: Array<
    | { _type: 'videoFile'; file: { asset: { url: string } }; caption?: string }
    | { _type: 'externalVideo'; url: string; caption?: string }
  >;
  gridColumns: number;
}

function getVimeoEmbedUrl(url: string): string | null {
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : null;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : null;
}

export default function VideoGrid({ videos, gridColumns }: VideoGridProps) {
  const handlePlay = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
      if (v !== e.currentTarget) v.pause();
    });
  };

  const getGridClass = () => {
    switch(gridColumns) {
      case 1: return 'grid grid-cols-1 md:grid-cols-1';
      case 2: return 'grid grid-cols-1 md:grid-cols-2';
      case 3: return 'grid grid-cols-1 md:grid-cols-3';
      case 4: return 'grid grid-cols-1 md:grid-cols-4';
      default: return 'grid grid-cols-1 md:grid-cols-4';
    }
  };

  return (
    <div className={`${getGridClass()} gap-1`}>
      {videos.map((video, idx) => {
        const caption = video.caption;
        
        // External video (Vimeo/YouTube)
        if (video._type === 'externalVideo') {
          const embedUrl = getVimeoEmbedUrl(video.url) || getYouTubeEmbedUrl(video.url);
          if (!embedUrl) return null;
          
          return (
            <ScrollReveal key={idx}>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full rounded"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {caption && (
                <p className="text-sm mt-1">{caption}</p>
              )}
            </ScrollReveal>
          );
        }
        
        // Video file upload
        if (video._type === 'videoFile' && video.file?.asset?.url) {
          return (
            <ScrollReveal key={idx}>
              <video
                src={video.file.asset.url}
                controls
                controlsList="nodownload noremoteplayback"
                playsInline
                preload="auto"
                className="w-full rounded"
                onPlay={handlePlay}
              />
              {caption && (
                <p className="text-sm mt-1">{caption}</p>
              )}
            </ScrollReveal>
          );
        }
        
        return null;
      })}
    </div>
  );
}
