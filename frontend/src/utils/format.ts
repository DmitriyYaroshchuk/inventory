import { Price } from "@/types";

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const pad = (value: number) => String(value).padStart(2, '0');

export const formatShortDate = (data: string) => {
    const date = new Date(data);
    return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)}`;
}

export const formatLongDate = (data: string) => {
    const date = new Date(data);
    return `${pad(date.getDate())} / ${MONTHS[date.getMonth()]} / ${date.getFullYear()}`;
}

export const formatFullDate = (iso: string) => {
    const date = new Date(iso);
    return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)} / ${date.getFullYear()}`;
};

export const getPrice = (prices: Price[], symbol: string) => {
    return prices.find((price) => price.symbol === symbol)?.value ?? 0;
}

export const formatMoney = (value: number) => {
    return value.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
}

const pluralRules = new Intl.PluralRules('ru-RU');

export const pluralize = (count: number, [one, few, many]: [string, string, string]) => {
    const rule = pluralRules.select(count);

    if (rule === 'one') return one;
    if (rule === 'few') return few;
    return many;
};
