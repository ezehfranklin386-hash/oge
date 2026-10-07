import { getYouTubeId, getVimeoId } from "@/lib/utils/video";

interface PropertyVideoProps {
  url: string | null | undefined;
  title: string;
}

export default function PropertyVideo({ url, title }: PropertyVideoProps) {
  if (!url) return null;

  const youtubeId = getYouTubeId(url);
  const vimeoId = !youtubeId ? getVimeoId(url) : null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-neutral-900">Video Tour</h2>
      <div className="mt-3">
        {youtubeId ? (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`${title} — video`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : vimeoId ? (
          <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title={`${title} — video`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video
            controls
            preload="metadata"
            className="aspect-video w-full rounded-xl bg-neutral-100"
            src={url}
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open video
            </a>
          </video>
        )}
      </div>
    </div>
  );
}
