'use client';

import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from '@/lib/i18n';

export default function Footer() {
    const { locale } = useLocale();
    const t = getDictionary(locale);

    return (
        <footer role="contentinfo" className="bg-muted text-muted-foreground text-center py-6 mt-10 transition-colors">
            <div className="container mx-auto px-4">
                 <p>© {new Date().getFullYear()} {t.footerCopyright}</p>
            </div>
        </footer>
    );
}
