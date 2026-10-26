import { describe, expect, it } from 'vitest';
import type { OrderSummary, Product } from '@/types';
import { countProductsByType, getOrderTotals } from './statistics';

const makeProduct = (type: string): Product => ({
  id: 1,
  serialNumber: 1,
  isNew: true,
  photo: null,
  title: 'Test product',
  type,
  specification: null,
  guarantee: { start: '2017-01-01T12:00:00', end: '2018-01-01T12:00:00' },
  price: [],
  order: { id: 1, title: 'Test order' },
  date: '2017-01-01T12:00:00',
});

describe('countProductsByType', () => {
  it('counts products of each type and sorts from most to least', () => {
    const products = [
      makeProduct('Laptops'),
      makeProduct('Monitors'),
      makeProduct('Phones'),
      makeProduct('Monitors'),
      makeProduct('Monitors'),
      makeProduct('Laptops'),
    ];

    expect(countProductsByType(products)).toEqual([
      { type: 'Monitors', count: 3 },
      { type: 'Laptops', count: 2 },
      { type: 'Phones', count: 1 },
    ]);
  });

  it('returns an empty array when there are no products', () => {
    expect(countProductsByType([])).toEqual([]);
  });
});

describe('getOrderTotals', () => {
  it('takes title and UAH total of each order', () => {
    const orders: OrderSummary[] = [
      {
        id: 1,
        title: 'Приход 1',
        description: null,
        date: '2017-06-29T12:00:00',
        productsCount: 2,
        total: [
          { value: 875, symbol: 'USD', isDefault: false },
          { value: 22750, symbol: 'UAH', isDefault: true },
        ],
      },
      {
        id: 2,
        title: 'Пустой приход',
        description: null,
        date: '2017-06-29T12:00:00',
        productsCount: 0,
        total: [],
      },
    ];

    expect(getOrderTotals(orders)).toEqual([
      { name: 'Приход 1', total: 22750 },
      { name: 'Пустой приход', total: 0 },
    ]);
  });
});
