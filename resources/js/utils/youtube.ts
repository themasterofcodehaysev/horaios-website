import { getImageUrl } from './imageUrl';

/**
 * Extracts YouTube video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - https://youtu.be/dQw4w9WgXcQ
 * - https://www.youtube.com/embed/dQw4w9WgXcQ
 * - https://www.youtube.com/live/dQw4w9WgXcQ
 * - https://www.youtube.com/shorts/dQw4w9WgXcQ
 * - Direct 11-character video ID
 */
export function getYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  // Regex matching all common YouTube URL formats
  const match = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([a-zA-Z0-9_-]{11})/i
  );

  return match ? match[1] : null;
}

/**
 * Returns the YouTube thumbnail URL for a given video URL or ID.
 */
export function getYouTubeThumbnail(url?: string | null, quality: 'hq' | 'maxres' = 'hq'): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  const qualityName = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg';
  return `https://img.youtube.com/vi/${id}/${qualityName}`;
}

/**
 * Returns the best available thumbnail for a sermon:
 * 1. Uploaded custom thumbnail (if present)
 * 2. YouTube thumbnail derived from youtube_url (if present)
 * 3. Fallback placeholder or empty string
 */
export function getSermonThumbnail(
  sermon?: { thumbnail?: string | null; youtube_url?: string | null; title?: string } | null,
  fallback?: string
): string {
  if (!sermon) return fallback || '';

  if (sermon.thumbnail) {
    const resolved = getImageUrl(sermon.thumbnail);
    if (resolved) return resolved;
  }

  if (sermon.youtube_url) {
    const ytThumb = getYouTubeThumbnail(sermon.youtube_url);
    if (ytThumb) return ytThumb;
  }

  return fallback || '';
}
