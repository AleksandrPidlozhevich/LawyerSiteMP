import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LocaleProvider } from "@/context/LocaleContext";
import { cookies, headers } from 'next/headers';
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { Suspense } from "react";
import YandexMetrika from "../components/YandexMetrika";
import GoogleAnalytics from "../components/GoogleAnalytics";
import GoogleTagManager from "../components/GoogleTagManager";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const headerList = await headers();
    const locale = resolveLocale(cookieStore.get('NEXT_LOCALE')?.value, headerList.get('accept-language'));
    const t = getDictionary(locale);

    return {
        title: t.metaTitle,
        description: t.metaDescription,
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
            <SpeedInsights />
            <Suspense fallback={null}>
                <YandexMetrika />
                <GoogleAnalytics />
                <GoogleTagManager />
            </Suspense>
        </ThemeProvider>
        </body>
        </html>
    );
}
