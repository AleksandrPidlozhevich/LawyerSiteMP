import PrivacyClient from '@/components/PrivacyClient';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { getDictionary, resolveLocale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pidlozhevich.by';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
  const t = getDictionary(locale);

  const privacyTitles: Record<string, string> = {
    ru: "Политика конфиденциальности",
    en: "Privacy Policy",
    by: "Палітыка канфідэнцыяльнасці"
  };
  
  const title = privacyTitles[locale] || privacyTitles['ru'];

  return {
    title: `${title} | ${t.siteName}`,
    description: `${title} - ${t.siteName}`,
  };
}

export default async function PrivacyPage() {
    const cookieStore = await cookies();
    const headerList = await headers();
    const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
    const t = getDictionary(locale);

    const privacyTitles: Record<string, string> = {
      ru: "Политика конфиденциальности",
      en: "Privacy Policy",
      by: "Палітыка канфідэнцыяльнасці"
    };

    const title = privacyTitles[locale] || privacyTitles['ru'];

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": t.home,
          "item": `${BASE_URL}/`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": title,
          "item": `${BASE_URL}/privacy`
        }
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <PrivacyClient />
      </>
    );
}
