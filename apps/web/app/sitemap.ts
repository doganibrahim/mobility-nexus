import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.erasmusmobility.com';
  const currentDate = new Date().toISOString();

  const publicRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/platform', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/marketplace', changeFrequency: 'daily', priority: 0.9 },
    { path: '/guide', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/library', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/news-and-events', changeFrequency: 'daily', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/kvkk', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/accessibility', changeFrequency: 'yearly', priority: 0.5 },
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
    priority: route.priority,
  }));
}
