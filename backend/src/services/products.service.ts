import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { Price, ProductDto, ProductGroup } from '../types';
import { sumPrices } from '../utils';

interface RawPrice {
  value: number;
  symbol: string;
  isDefault: number | boolean;
}

interface ProductRow extends RowDataPacket {
  id: number;
  order_id: number;
  order_title: string;
  serial_number: number;
  is_new: number;
  photo: string | null;
  title: string;
  type: string;
  specification: string | null;
  guarantee_start: Date;
  guarantee_end: Date;
  price: RawPrice[] | string;
  date: Date;
}

interface TypeRow extends RowDataPacket {
  type: string;
}

const parsePrices = (raw: RawPrice[] | string): Price[] => {
  const list: RawPrice[] = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return list.map((x) => ({
    value: Number(x.value),
    symbol: x.symbol,
    isDefault: Boolean(x.isDefault),
  }));
};

export interface ProductsFilter {
  type?: string;
  orderId?: number;
  search?: string;
}

export const getProducts = async (filter: ProductsFilter = {}): Promise<ProductDto[]> => {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (filter.type) {
    conditions.push('p.type = ?');
    params.push(filter.type);
  }
  if (filter.orderId !== undefined) {
    conditions.push('p.order_id = ?');
    params.push(filter.orderId);
  }
  if (filter.search) {
    conditions.push('p.title LIKE ?');
    params.push(`%${filter.search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [products] = await pool.query<ProductRow[]>(
    `SELECT p.*, o.title AS order_title
       FROM products p
       JOIN orders o ON o.id = p.order_id
       ${where}
      ORDER BY p.id`,
    params,
  );

  return products.map((p) => ({
    id: p.id,
    serialNumber: p.serial_number,
    isNew: p.is_new === 1,
    photo: p.photo,
    title: p.title,
    type: p.type,
    specification: p.specification,
    guarantee: {
      start: p.guarantee_start.toISOString(),
      end: p.guarantee_end.toISOString(),
    },
    price: parsePrices(p.price),
    order: { id: p.order_id, title: p.order_title },
    date: p.date.toISOString(),
  }));
};

export const getProductTypes = async (): Promise<string[]> => {
  const [rows] = await pool.query<TypeRow[]>('SELECT DISTINCT type FROM products ORDER BY type');
  return rows.map((row) => row.type);
};

export const deleteProduct = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export interface NewProduct {
  orderId: number;
  title: string;
  type: string;
  serialNumber: number;
  isNew: boolean;
  specification: string | null;
  guaranteeStart: string;
  guaranteeEnd: string;
  priceUsd: number;
  priceUah: number;
}

export const createProduct = async (product: NewProduct): Promise<number> => {
  const price = JSON.stringify([
    { value: product.priceUsd, symbol: 'USD', isDefault: 0 },
    { value: product.priceUah, symbol: 'UAH', isDefault: 1 },
  ]);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO products
       (order_id, serial_number, is_new, photo, title, type, specification,
        guarantee_start, guarantee_end, price)
     VALUES (?, ?, ?, 'monitor.png', ?, ?, ?, ?, ?, ?)`,
    [
      product.orderId,
      product.serialNumber,
      product.isNew ? 1 : 0,
      product.title,
      product.type,
      product.specification,
      product.guaranteeStart,
      product.guaranteeEnd,
      price,
    ],
  );

  return result.insertId;
};

// Группы продуктов по типу: количество, сколько новых и сумма в каждой валюте
export const getProductGroups = async (): Promise<ProductGroup[]> => {
  const products = await getProducts();

  const byType = new Map<string, ProductDto[]>();
  for (const product of products) {
    const list = byType.get(product.type) ?? [];
    list.push(product);
    byType.set(product.type, list);
  }

  return [...byType.entries()]
    .map(([type, list]) => ({
      type,
      productsCount: list.length,
      newCount: list.filter((product) => product.isNew).length,
      total: sumPrices(list),
    }))
    .sort((a, b) => a.type.localeCompare(b.type));
};
