import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export type Locale = 'ru' | 'en' | 'by';

const supportedLocales: Locale[] = ['ru', 'en', 'by'];

export const dictionaries = { ru, en, by } as const;

export const isLocale = (value?: string | null): value is Locale => {
  return value === 'ru' || value === 'en' || value === 'by';
};

export const parseLocale = (value?: string | null): Locale => {
  return isLocale(value) ? value : 'ru';
};

const parseAcceptLanguage = (header?: string | null): Locale | null => {
  if (!header) {
    return null;
  }

  const candidates = header
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const primary = tag.toLowerCase().split('-')[0];
      const qParam = params.find((p) => p.trim().startsWith('q='));
      let q = 1;

      if (qParam) {
        const parsed = Number(qParam.trim().slice(2));
        if (!Number.isNaN(parsed)) {
          q = parsed;
        }
      }

      return { primary, q, index };
    })
    .filter((item) => supportedLocales.includes(item.primary as Locale));

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => b.q - a.q || a.index - b.index);
  return candidates[0].primary as Locale;
};

export const resolveLocale = (
  cookieLocale?: string | null,
  acceptLanguage?: string | null,
): Locale => {
  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const headerLocale = parseAcceptLanguage(acceptLanguage);
  return headerLocale ?? 'ru';
};

export const getDictionary = (locale: Locale) => dictionaries[locale];

export const getBaseUrl = (): string => {
  const fallback = 'https://pidlozhevich.by';
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || fallback).trim();
  const sanitized = raw.replace(/[)\]\s]+$/g, '');

  try {
    const url = new URL(sanitized);
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
};
