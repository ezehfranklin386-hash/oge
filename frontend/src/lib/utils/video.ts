/** Extract an 11-char YouTube video ID from any common URL shape
 *  (watch?v=, youtu.be/, /shorts/, /embed/, /live/; extra params ignored).
 *  Null if the URL is not a recognizable YouTube link. */
export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|embed\/|live\/))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/** Extract a Vimeo video ID from vimeo.com/<id> or player.vimeo.com/video/<id>;
 *  null otherwise. */
export function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}
