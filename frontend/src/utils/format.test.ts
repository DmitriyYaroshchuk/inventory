import { describe, expect, it } from 'vitest';
import { formatLongDate, formatMoney, formatShortDate, getPrice, pluralize } from './format';

describe('getPrice', () => {
    const prices = [
        { value: 100, symbol: 'USD', isDefault: false },
        { value: 2600, symbol: 'UAH', isDefault: true },
    ];

    it('returns value for the requested currency', () => {
        expect(getPrice(prices, 'USD')).toBe(100);
        expect(getPrice(prices, 'UAH')).toBe(2600);
    });

    it('returns 0 when currency is missing', () => {
        expect(getPrice(prices, '')).toBe(0);
    });

    it('returns 0 for an empty list', () => {
        expect(getPrice([], 'USD')).toBe(0);
    });
});

describe('pluralize', () => {
    const forms: [string, string, string] = ['Продукт', 'Продукта', 'Продуктов'];

    it.each([
        [1, 'Продукт'],
        [21, 'Продукт'],
        [2, 'Продукта'],
        [4, 'Продукта'],
        [22, 'Продукта'],
        [0, 'Продуктов'],
        [5, 'Продуктов'],
        [11, 'Продуктов'],
        [12, 'Продуктов'],
        [25, 'Продуктов'],
    ])('%i → %s', (count, expected) => {
        expect(pluralize(count, forms)).toBe(expected);
    });
});

describe('formatShortDate', () => {
    it('formats date as "dd / MM"', () => {
        expect(formatShortDate('2017-06-29T12:00:00')).toBe('29 / 06');
    });

    it('pads single-digit day and month with zero', () => {
        expect(formatShortDate('2017-04-06T12:00:00')).toBe('06 / 04');
    });
});

describe('formatLongDate', () => {
    it('formats date as "dd / Мес / yyyy"', () => {
        expect(formatLongDate('2017-09-06T12:00:00')).toBe('06 / Сен / 2017');
    });

    it('uses correct month names at the edges of the year', () => {
        expect(formatLongDate('2026-01-15T12:00:00')).toBe('15 / Янв / 2026');
        expect(formatLongDate('2026-12-31T12:00:00')).toBe('31 / Дек / 2026');
    });
});

describe('formatMoney', () => {
    const normalizeSpaces = (value: string) => value.replace(/\s/g, ' ');

    it('separates thousands with a space', () => {
        expect(normalizeSpaces(formatMoney(2600))).toBe('2 600');
        expect(normalizeSpaces(formatMoney(1234567))).toBe('1 234 567');
    });

    it('keeps at most two decimal places with a comma', () => {
        expect(normalizeSpaces(formatMoney(1234.5))).toBe('1 234,5');
        expect(normalizeSpaces(formatMoney(1234.567))).toBe('1 234,57');
    });

    it('formats zero', () => {
        expect(formatMoney(0)).toBe('0');
    });
})