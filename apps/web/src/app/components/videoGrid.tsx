'use client';

interface VideoGridProps {
  videos: Array<
    | { file: { asset: { url: string } }; caption?: string }
    | { asset: { url: string } }
  >;
  gridColumns: number;
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
        // Handle new format (object with file and caption) and old format (direct file)
        const videoUrl = 'file' in video && video.file?.asset?.url 
          ? video.file.asset.url 
          : 'asset' in video && video.asset?.url 
          ? video.asset.url 
          : null;
        const caption = 'caption' in video ? video.caption : undefined;
        
        if (!videoUrl) return null;
        
        return (
          <div key={idx}>
            <video
              src={videoUrl}
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
          </div>
        );
      })}
    </div>
  );
}
