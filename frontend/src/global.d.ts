import type messages from '../messages/ru.json';
import type { Locale } from './i18n/config';

// Подсказки и проверка ключей переводов в TypeScript: t('nav.orders')
declare module 'next-intl' {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
    }
}
