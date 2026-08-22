import { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
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

/**
 * Keeps the document title and description in sync with the current route.
 * Small enough not to justify a dependency like react-helmet.
 */
export default function SeoHead({ title, description }: SeoHeadProps) {
  useEffect(() => {
    document.title = title;
    upsertMeta('meta[name="description"]', 'name', 'description', description);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
  }, [title, description]);

  return null;
}
