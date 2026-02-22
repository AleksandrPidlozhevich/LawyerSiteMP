import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';
import { cookies } from 'next/headers';
import { getDictionary, parseLocale } from '@/lib/i18n';

export default async function NotFound() {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get('NEXT_LOCALE')?.value);
  const t = getDictionary(locale);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-muted p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">{t.pageNotFound || 'Page Not Found'}</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        {locale === 'ru' 
          ? 'К сожалению, запрашиваемая вами страница не существует или была перемещена.'
          : locale === 'by'
          ? 'На жаль, старонка, якую вы шукаеце, не існуе альбо была перамешчана.'
          : 'Sorry, the page you are looking for does not exist or has been moved.'}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        <Home size={20} />
        {t.home || 'Go Home'}
      </Link>
    </div>
  );
}
