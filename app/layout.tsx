import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LocaleProvider } from "@/context/LocaleContext";
import { cookies, headers } from 'next/headers';
import { getBaseUrl, getDictionary, resolveLocale } from "@/lib/i18n";
import { Suspense } from "react";
import YandexMetrika from "../components/YandexMetrika";
import GoogleAnalytics from "../components/GoogleAnalytics";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const headerList = await headers();
    const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
    const t = getDictionary(locale);
    const baseUrl = getBaseUrl();
    const canonicalUrl = baseUrl;
    const ogImage = '/PidlozhevichM.png';

    return {
        title: t.metaTitle,
        description: t.metaDescription,
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: canonicalUrl,
            languages: {
                ru: `${baseUrl}?lang=ru`,
                en: `${baseUrl}?lang=en`,
                be: `${baseUrl}?lang=by`,
                'x-default': baseUrl,
            },
        },
        openGraph: {
            type: 'website',
            url: canonicalUrl,
            title: t.metaTitle,
            description: t.metaDescription,
            siteName: t.siteName,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: t.metaTitle,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: t.metaTitle,
            description: t.metaDescription,
            images: [ogImage],
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
    };
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
}

import { AccessibilityProvider } from "@/context/AccessibilityContext";
import AppLayout from "../components/AppLayout";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const headerList = await headers();
    const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));

    return (
        <html lang={locale} suppressHydrationWarning>
        <body className="antialiased font-sans transition-colors flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LocaleProvider initialLocale={locale}>
                <AccessibilityProvider>
                    <AppLayout>{children}</AppLayout>
                </AccessibilityProvider>
            </LocaleProvider>
            <Suspense fallback={null}>
                <YandexMetrika />
                <GoogleAnalytics />
            </Suspense>
        </ThemeProvider>
        </body>
        </html>
    );
}
