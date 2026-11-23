import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/menu`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${site.url}/order`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${site.url}/merch`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/regulars`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${site.url}/find-us`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
