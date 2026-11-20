import type { Price, ProductDto } from './types';

/** Разбирает id из URL; возвращает null, если это не положительное целое. */
export const parseId = (value: string): number | null => {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

export const sumPrices = (products: ProductDto[]): Price[] => {
  const sums = new Map<string, Price>();
  for (const product of products) {
    for (const price of product.price) {
      const current = sums.get(price.symbol);
      if (current) current.value = round2(current.value + price.value);
      else sums.set(price.symbol, { ...price, value: round2(price.value) });
    }
  }
  return [...sums.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
};
