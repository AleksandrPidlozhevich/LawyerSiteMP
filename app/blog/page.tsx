import { getBlogPosts } from '@/lib/notion';
import { Metadata } from 'next';
import BlogList from '@/components/BlogList';
import { cookies, headers } from 'next/headers';
import { getBaseUrl, getDictionary, resolveLocale } from '@/lib/i18n';

const BASE_URL = getBaseUrl();

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
  const t = getDictionary(locale);

  const titleFull = t.blogMetaTitle;
  const descriptionFull = t.blogMetaDescription;
  const title = titleFull.length > 60 ? `${titleFull.slice(0, 57)}...` : titleFull;
  const description = descriptionFull.length > 160 ? `${descriptionFull.slice(0, 157)}...` : descriptionFull;
  const canonical = `${BASE_URL}/blog?lang=${locale}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonical,
      languages: {
        ru: `${BASE_URL}/blog?lang=ru`,
        en: `${BASE_URL}/blog?lang=en`,
        be: `${BASE_URL}/blog?lang=by`,
        'x-default': `${BASE_URL}/blog`,
      },
    },
  };
}

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
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
        "name": t.blog,
        "item": `${BASE_URL}/blog`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogList posts={posts} />
    </>
  );
}
