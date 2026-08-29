import React, { useEffect, useRef } from 'react';

/**
 * Attribute used to mark every <meta>/<link>/<script> tag this component
 * owns, so repeated renders can find-and-update them in place (no
 * duplicates ever accumulate in <head>) and so they can all be swept away
 * together when the owning page unmounts.
 */
const MANAGED_ATTR = 'data-seo-managed';

export interface SeoStructuredData {
  '@context'?: string;
  '@type'?: string;
  [key: string]: unknown;
}

export interface SeoProps {
  /** Document title. Callers should already include any site-name suffix. */
  title: string;
  description?: string | null;
  canonicalUrl?: string | null;
  /** Absolute (or root-relative) URL of a representative image, used for og:image. */
  image?: string | null;
  /** Open Graph type, e.g. 'website' or 'article'. Defaults to 'website'. */
  type?: string;
  /** Optional JSON-LD structured data, rendered as a single <script type="application/ld+json"> tag. */
  jsonLd?: SeoStructuredData | null;
  /** Optional breadcrumb items for BreadcrumbList schema */
  breadcrumbs?: Array<{ name: string; item: string }> | null;
}

function upsertMeta(attrName: 'name' | 'property', attrValue: string, content?: string | null): void {
  const selector = `meta[${MANAGED_ATTR}="true"][${attrName}="${attrValue}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.setAttribute('content', content);
    return;
  }

  const tag = document.createElement('meta');
  tag.setAttribute(attrName, attrValue);
  tag.setAttribute('content', content);
  tag.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(tag);
}

function upsertLink(rel: string, href?: string | null): void {
  const selector = `link[${MANAGED_ATTR}="true"][rel="${rel}"]`;
  const existing = document.head.querySelector<HTMLLinkElement>(selector);

  if (!href) {
    existing?.remove();
    return;
  }

  if (existing) {
    existing.setAttribute('href', href);
    return;
  }

  const tag = document.createElement('link');
  tag.setAttribute('rel', rel);
  tag.setAttribute('href', href);
  tag.setAttribute(MANAGED_ATTR, 'true');
  document.head.appendChild(tag);
}

function upsertJsonLd(data?: SeoStructuredData | null, id?: string): void {
  const selector = id 
    ? `script[type="application/ld+json"][${MANAGED_ATTR}="true"][data-schema-id="${id}"]`
    : `script[type="application/ld+json"][${MANAGED_ATTR}="true"]:not([data-schema-id])`;
  const existing = document.head.querySelector<HTMLScriptElement>(selector);

  if (!data) {
    existing?.remove();
    return;
  }

  const json = JSON.stringify(data);

  if (existing) {
    existing.textContent = json;
    return;
  }

  const tag = document.createElement('script');
  tag.setAttribute('type', 'application/ld+json');
  tag.setAttribute(MANAGED_ATTR, 'true');
  if (id) {
    tag.setAttribute('data-schema-id', id);
  }
  tag.textContent = json;
  document.head.appendChild(tag);
}

/**
 * Imperatively manages document <head> SEO tags for a single public page:
 * <title>, meta description, canonical link, Open Graph tags, and an
 * optional JSON-LD structured data script.
 *
 * There is no react-helmet (or similar) dependency in this project, so tags
 * are created/updated/removed directly via the DOM inside a `useEffect`.
 * Every tag this component owns is marked with `data-seo-managed="true"` so
 * renders update existing tags in place (no duplicates), tags whose value
 * becomes falsy are removed rather than left stale, and everything is swept
 * away (title included, restored to whatever it was before this component
 * mounted) when the owning page unmounts.
 *
 * Renders nothing.
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  description = null,
  canonicalUrl = null,
  image = null,
  type = 'website',
  jsonLd = null,
  breadcrumbs = null,
}) => {
  const previousTitleRef = useRef<string | null>(null);

  // Build breadcrumb schema if provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  } as SeoStructuredData : null;

  // Find-or-create / update-in-place whenever the relevant props change.
  useEffect(() => {
    if (previousTitleRef.current === null) {
      previousTitleRef.current = document.title;
    }
    document.title = title;

    upsertMeta('name', 'description', description);
    upsertLink('canonical', canonicalUrl);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:image', image);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonicalUrl);

    upsertJsonLd(jsonLd);
    upsertJsonLd(breadcrumbSchema, 'breadcrumbs');
  }, [title, description, canonicalUrl, image, type, jsonLd, breadcrumbs]);

  // Full cleanup only when the owning page actually unmounts (route change
  // away) -- restore the pre-existing title and remove every managed tag so
  // nothing leaks onto pages that don't render a <Seo /> of their own.
  useEffect(() => {
    return () => {
      if (previousTitleRef.current !== null) {
        document.title = previousTitleRef.current;
      }
      document.head.querySelectorAll(`[${MANAGED_ATTR}="true"]`).forEach((el) => el.remove());
    };
  }, []);

  // Cleanup breadcrumb schema when breadcrumbs prop changes or becomes null
  useEffect(() => {
    return () => {
      cleanupJsonLd('breadcrumbs');
    };
  }, [breadcrumbs]);

  return null;
};

export default Seo;
