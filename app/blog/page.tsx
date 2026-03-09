import { getBlogPosts } from '@/lib/notion';
import { Metadata } from 'next';
import BlogList from '@/components/BlogList';
import { cookies, headers } from 'next/headers';
import { getDictionary, resolveLocale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pidlozhevich.by';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
  const t = getDictionary(locale);

  return {
    title: t.blogTitle,
    description: t.blogDescription,
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
