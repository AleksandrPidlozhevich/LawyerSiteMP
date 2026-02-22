import ContactsClient from '@/components/ContactsClient';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary, parseLocale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pidlozhevich.by';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get('NEXT_LOCALE')?.value);
  const t = getDictionary(locale);

  return {
    title: `${t.contactsTitle} | ${t.siteName}`,
    description: t.contactsSubtitle,
  };
}

export default async function ContactsPage() {
    const cookieStore = await cookies();
    const locale = parseLocale(cookieStore.get('NEXT_LOCALE')?.value);
    const t = getDictionary(locale);

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
          "name": t.contact,
          "item": `${BASE_URL}/contacts`
        }
      ]
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ContactsClient />
      </>
    );
}
