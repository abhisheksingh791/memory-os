import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://memory-os.vercel.app';

  const routes = [
    '',
    '/dashboard',
    '/notes',
    '/tasks',
    '/journal',
    '/calendar',
    '/graph',
    '/mindmap',
    '/collections',
    '/bookmarks',
    '/gallery',
    '/voicenotes',
    '/pdf',
    '/timeline',
    '/favorites',
    '/archive',
    '/trash',
    '/search',
    '/settings',
    '/about',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
