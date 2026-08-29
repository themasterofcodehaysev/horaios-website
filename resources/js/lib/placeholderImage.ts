function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generates an inline SVG placeholder that works offline (no external CDN).
 */
export function placeholderImage(
  width: number,
  height: number,
  label = '',
  backgroundColor = '#e5e7eb',
  textColor = '#6b7280',
): string {
  const fontSize = Math.max(12, Math.min(width, height) / 12);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="100%" height="100%" fill="${backgroundColor}"/>`,
    label
      ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="system-ui, sans-serif" font-size="${fontSize}">${escapeXml(label)}</text>`
      : '',
    '</svg>',
  ].join('');

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
