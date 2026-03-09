 import { getBlogPostBySlug } from '@/lib/notion';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import BlogPostContent from '@/components/BlogPostContent';
import { cookies, headers } from 'next/headers';
import { getDictionary, resolveLocale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pidlozhevich.by';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  
  const cookieStore = await cookies();
  const headerList = await headers();
  const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
  const t = getDictionary(locale);

  if (!post) {
    return {
      title: t.articleNotFound,
    };
  }

  return {
    title: `${post.title} | ${t.siteName}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${BASE_URL}/blog/${post.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogPostContent post={post} />
    </>
  );
}
