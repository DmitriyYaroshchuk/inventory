export const LOCALES = ['ru', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_COOKIE = 'locale';

export const isLocale = (value: unknown): value is Locale =>
    LOCALES.includes(value as Locale);
