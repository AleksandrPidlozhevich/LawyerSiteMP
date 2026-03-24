import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/i18n';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/api/',
          '/*?etext=*',
          '/*?from=*',
          '/*?utm_*',
          '/*?gclid=*',
          '/*?fbclid=*',
          '/*?yclid=*',
          '/*?ysclid=*',
        ],
      },
    ],
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
