'use client';

import { useAccessibility } from "@/context/AccessibilityContext";
import { Header } from "./Header";
import AccessibilityControls from "./AccessibilityControls";
import Footer from "./Footer";
import { useLocale } from "@/context/LocaleContext";
import { getDictionary } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isEnabled } = useAccessibility();
    const { locale } = useLocale();
    const t = getDictionary(locale);
    const pathname = usePathname();

    const skipLabel = locale === 'ru' ? 'Перейти к основному контенту' : locale === 'en' ? 'Skip to main content' : 'Перайсці да асноўнага зместу';

    if (isEnabled) {
        return (
            <>
                <a href="#main-content" className="skip-link">{skipLabel}</a>
                <AccessibilityControls />
                <nav className="border-b-2 border-current p-4" aria-label={t.menuTitle}>
                    <ul className="container mx-auto flex flex-wrap gap-6 text-lg font-bold">
                        <li>
                            <Link 
                                href="/" 
                                className={`hover:underline underline-offset-4 ${pathname === '/' ? 'underline decoration-2' : ''}`}
                                aria-current={pathname === '/' ? 'page' : undefined}
                            >
                                {t.home}
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/blog" 
                                className={`hover:underline underline-offset-4 ${pathname.startsWith('/blog') ? 'underline decoration-2' : ''}`}
                                aria-current={pathname.startsWith('/blog') ? 'page' : undefined}
                            >
                                {t.blog}
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/contacts" 
                                className={`hover:underline underline-offset-4 ${pathname === '/contacts' ? 'underline decoration-2' : ''}`}
                                aria-current={pathname === '/contacts' ? 'page' : undefined}
                            >
                                {t.contact}
                            </Link>
                        </li>
                    </ul>
                </nav>
                <main id="main-content" className="container mx-auto p-4 md:p-6 flex-1 a11y-content" tabIndex={-1}>{children}</main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <a href="#main-content" className="skip-link">{skipLabel}</a>
            <Header />
            <main id="main-content" className="container mx-auto p-4 md:p-6 flex-1" tabIndex={-1}>{children}</main>
            <Footer />
        </>
    );
}
