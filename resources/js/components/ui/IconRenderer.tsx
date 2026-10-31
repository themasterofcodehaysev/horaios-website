import React from 'react';

interface IconRendererProps {
  icon?: string | null;
  className?: string;
  fallback?: React.ReactNode;
}

/**
 * Renders an icon from various formats:
 * - Full HTML snippet: `<i class="fa-solid fa-church"></i>` or `<svg>...</svg>`
 * - Class string: `fa-solid fa-church` or `fas fa-clock`
 * - Fallback component if empty
 */
export const IconRenderer: React.FC<IconRendererProps> = ({
  icon,
  className = '',
  fallback = null,
}) => {
  if (!icon || !icon.trim()) {
    return <>{fallback}</>;
  }

  const trimmed = icon.trim();

  // If user pasted a full HTML tag like <i class="..."></i> or <svg>...</svg>
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return (
      <span
        className={`inline-flex items-center justify-center leading-none ${className}`}
        dangerouslySetInnerHTML={{ __html: trimmed }}
      />
    );
  }

  // If user entered a FontAwesome or utility class string e.g. "fa-solid fa-church"
  if (trimmed.startsWith('fa-') || trimmed.includes(' fa-') || trimmed.startsWith('fas ') || trimmed.startsWith('far ')) {
    return <i className={`${trimmed} ${className}`} aria-hidden="true" />;
  }

  // Otherwise treat as HTML or class fallback
  return (
    <span
      className={`inline-flex items-center justify-center leading-none ${className}`}
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
};

export default IconRenderer;
