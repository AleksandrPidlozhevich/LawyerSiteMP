import { NextResponse } from 'next/server';
import { getBaseUrl } from '@/lib/i18n';

export async function GET() {
  const baseUrl = getBaseUrl();
  const robotsTxt = `
User-agent: *
Allow: /
Disallow: /api/

User-agent: Yandex
Allow: /
Disallow: /api/
Clean-param: etext&from&utm_source&utm_medium&utm_campaign&gclid&fbclid&yclid&ysclid /

Host: ${baseUrl}
Sitemap: ${baseUrl}/sitemap.xml
`.trim();

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}