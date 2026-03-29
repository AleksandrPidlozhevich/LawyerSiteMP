'use client';
import Link from 'next/link';
import { Home, RefreshCcw } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';
import { getDictionary } from '@/lib/i18n';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useLocale();
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <RefreshCcw className="w-12 h-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-4">{t.unknownError || 'Something went wrong!'}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again later.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <RefreshCcw size={18} />
          {t.tryAgain || 'Try again'}
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
        >
          <Home size={18} />
          {t.home || 'Home'}
        </Link>
      </div>
    </div>
  );
}
