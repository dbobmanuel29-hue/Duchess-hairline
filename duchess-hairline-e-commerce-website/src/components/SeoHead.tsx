import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'product';
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  tag.href = href;
}

function upsertStructuredData(data?: Record<string, unknown> | Record<string, unknown>[]) {
  const id = 'duchess-structured-data';
  let script = document.head.querySelector<HTMLScriptElement>(`script#${id}`);
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function SeoHead({ title, description, image, type = 'website', structuredData }: SeoHeadProps) {
  useEffect(() => {
    const canonicalUrl = `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '') || window.location.origin;
    const shareImage = image || `${window.location.origin}/social-share.svg`;

    document.title = title;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1');
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type);
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Duchess Hairline');
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', shareImage);
    upsertMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage);
    upsertLink('canonical', canonicalUrl);
    upsertStructuredData(structuredData);

    return () => {
      document.head.querySelector('#duchess-structured-data')?.remove();
    };
  }, [title, description, image, type, structuredData]);

  return null;
}
