import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/notion';
import { getBaseUrl } from '@/lib/i18n';

const BASE_URL = getBaseUrl();
const LOCALES = ['ru', 'en', 'by'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const now = new Date();

  const staticPages = [
    { path: '', changeFrequency: 'yearly' as const, priority: 1, lastModified: now },
    { path: '/blog', changeFrequency: 'daily' as const, priority: 0.8, lastModified: now },
    { path: '/contacts', changeFrequency: 'monthly' as const, priority: 0.5, lastModified: now },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3, lastModified: now },
  ];

  const staticUrls = staticPages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}${page.path}?lang=${locale}`,
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
  );

  const xDefaultStaticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: Math.max(0.1, page.priority - 0.2),
  }));

  const blogUrls = posts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/blog/${post.slug}?lang=${locale}`,
      lastModified: new Date(post.publishedDate),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  );

  const xDefaultBlogUrls = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticUrls,
    ...xDefaultStaticUrls,
    ...blogUrls,
    ...xDefaultBlogUrls,
  ];
}
