import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/trash', '/settings'],
    },
    sitemap: 'https://memory-os.vercel.app/sitemap.xml',
  };
}
