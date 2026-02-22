import { ru } from '@/locales/ru';
import { en } from '@/locales/en';
import { by } from '@/locales/by';

export type Locale = 'ru' | 'en' | 'by';

export const dictionaries = { ru, en, by } as const;

export const parseLocale = (value?: string | null): Locale => {
  if (value === 'ru' || value === 'en' || value === 'by') {
    return value;
  }
  return 'ru';
};

export const getDictionary = (locale: Locale) => dictionaries[locale];
