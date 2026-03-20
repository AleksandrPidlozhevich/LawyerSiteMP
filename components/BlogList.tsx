'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import { BlogPost } from '@/lib/notion';
import { useLocale } from '@/context/LocaleContext';
import { useAccessibility } from '@/context/AccessibilityContext';
import { dictionaries, getDictionary } from '@/lib/i18n';

interface BlogListProps {
    posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
    const { locale } = useLocale();
    const { isEnabled } = useAccessibility();
    const t = getDictionary(locale);

    const dateLocale = locale === 'by' ? 'be-BY' : locale === 'en' ? 'en-US' : 'ru-RU';

    const normalizeAuthor = (author: string) => {
        const value = author?.trim();
        if (!value) return t.authorName;
        // Check if the value matches any of the localized author names (meaning it's the default author)
        if (value === dictionaries.ru.authorName || value === dictionaries.en.authorName || value === dictionaries.by.authorName) return t.authorName;
        // Also check for the hardcoded string that might be in old cache
        if (value === 'Николай Пидложевич') return t.authorName;
        return value;
    };

    useEffect(() => {
        if (isEnabled) return;

        const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "1700px 0px", threshold: 0.05 },
        );

        elements.forEach((element) => observer.observe(element));
        return () => observer.disconnect();
    }, [isEnabled]);

    if (isEnabled) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold mb-8">{t.blog}</h1>

                {posts.length === 0 ? (
                    <div className="text-xl">
                        {t.noPosts}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {posts.map((post) => (
                            <article key={post.id} className="border-b-2 border-current pb-6">
                                <h2 className="text-3xl font-bold mb-4">
                                    <Link href={`/blog/${post.slug}`} className="underline hover:no-underline">
                                        {post.title}
                                    </Link>
                                </h2>

                                {post.excerpt && (
                                    <p className="text-xl mb-4">{post.excerpt}</p>
                                )}

                                <div className="flex flex-wrap gap-4 text-lg">
                                    <span>{normalizeAuthor(post.author)}</span>
                                    <span>{new Date(post.publishedDate).toLocaleDateString(dateLocale)}</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="reveal text-3xl font-bold mb-8" data-reveal>{t.blog}</h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-600">
                    {t.noPosts}
                </div>
            ) : (
                <div className="reveal grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-reveal>
                    {posts.map((post) => (
                        <article key={post.id} className="card-base border p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
                            {post.coverImage && (
                                <div className="relative w-full h-48 mb-4">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover rounded"
                                    />
                                </div>
                            )}

                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                                    {post.title}
                                </Link>
                            </h2>

                            {post.excerpt && (
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                            )}

                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.filter((tag): tag is string => typeof tag === 'string').map((tag) => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded text-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                                <span>{normalizeAuthor(post.author)}</span>
                                <span>{new Date(post.publishedDate).toLocaleDateString(dateLocale)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
