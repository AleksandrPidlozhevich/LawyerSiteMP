import PrivacyClient from '@/components/PrivacyClient';
import { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { getBaseUrl, getDictionary, resolveLocale } from '@/lib/i18n';

const BASE_URL = getBaseUrl();

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
  const titleFull = `${title} | ${t.siteName}`;
  const descriptionFull = `${title} — ${t.siteName}. ${t.privacyMetaDescription}`;
  const titleFinal = titleFull.length > 60 ? `${titleFull.slice(0, 57)}...` : titleFull;
  const descriptionFinal = descriptionFull.length > 160 ? `${descriptionFull.slice(0, 157)}...` : descriptionFull;
  const canonical = `${BASE_URL}/privacy?lang=${locale}`;

  return {
    title: titleFinal,
    description: descriptionFinal,
    alternates: {
      canonical: canonical,
      languages: {
        ru: `${BASE_URL}/privacy?lang=ru`,
        en: `${BASE_URL}/privacy?lang=en`,
        be: `${BASE_URL}/privacy?lang=by`,
        'x-default': `${BASE_URL}/privacy`,
      },
    },
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
