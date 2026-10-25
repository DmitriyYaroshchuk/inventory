import type { Locale } from '@/i18n/config';
import type { Price } from '@/types';


const MONTHS: Record<Locale, string[]> = {
    ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const pad = (value: number) => String(value).padStart(2, '0');

export const formatShortDate = (data: string) => {
    const date = new Date(data);
    return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)}`;
}

export const formatLongDate = (value: string, locale: Locale = 'ru') => {
    const date = new Date(value);
    return `${pad(date.getDate())} / ${getMonthName(date.getMonth(), locale)} / ${date.getFullYear()}`;
};

export const getMonthName = (monthIndex: number, locale: Locale) => MONTHS[locale][monthIndex];

export const getPrice = (prices: Price[], symbol: string) => {
    return prices.find((price) => price.symbol === symbol)?.value ?? 0;
}

export const formatMoney = (value: number, locale: Locale = 'ru') => {
    return value.toLocaleString(locale, { maximumFractionDigits: 2 });
}
