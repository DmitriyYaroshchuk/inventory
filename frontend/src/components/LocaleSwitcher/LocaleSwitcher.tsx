'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LOCALE_COOKIE, LOCALES, type Locale } from '@/i18n/config';
import './LocaleSwitcher.scss';

const saveLocaleToCookie = (locale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
};

const LocaleSwitcher = () => {
    const locale = useLocale();
    const t = useTranslations('topMenu');
    const router = useRouter();

    const handleChange = (next: Locale) => {
        saveLocaleToCookie(next);
        router.refresh();
    };

    return (
        <div className="locale-switcher" role="group" aria-label={t('language')}>
            {LOCALES.map((code) => (
                <button
                    key={code}
                    type="button"
                    className={`locale-switcher__button${code === locale ? ' locale-switcher__button--active' : ''}`}
                    aria-pressed={code === locale}
                    onClick={() => handleChange(code)}
                >
                    {code.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
export default LocaleSwitcher;