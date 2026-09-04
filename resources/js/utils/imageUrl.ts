/**
 * Resolves an image URL safely for the client.
 * Handles storage URLs, localhost replacements, relative paths, blobs, and external URLs.
 */
export function getImageUrl(url?: string | null): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  // Already a full external URL, blob URL, or data URL
  if (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('https://') ||
    (trimmed.startsWith('http://') && !trimmed.startsWith('http://localhost/storage'))
  ) {
    return trimmed;
  }

  // Legacy localhost URL replacement
  if (trimmed.startsWith('http://localhost/storage')) {
    return trimmed.replace('http://localhost/storage', '/storage');
  }

  // If path starts with uploads/, prepend /storage/
  if (trimmed.startsWith('uploads/')) {
    return `/storage/${trimmed}`;
  }

  // If path starts with storage/, prepend /
  if (trimmed.startsWith('storage/')) {
    return `/${trimmed}`;
  }

  return trimmed;
}

export default getImageUrl;
