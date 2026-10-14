import type { RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { Price, ProductDto } from '../types';

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
  created_at: Date;
}

interface PriceRow extends RowDataPacket {
  product_id: number;
  value: number;
  symbol: string;
  is_default: number;
}

interface TypeRow extends RowDataPacket {
  type: string;
}

export interface ProductsFilter {
  type?: string;
  orderId?: number;
}

export async function getProducts(filter: ProductsFilter = {}): Promise<ProductDto[]> {
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

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [products] = await pool.query<ProductRow[]>(
    `SELECT p.*, o.title AS order_title
       FROM products p
       JOIN orders o ON o.id = p.order_id
       ${where}
      ORDER BY p.id`,
    params,
  );

  if (products.length === 0) return [];

  const [prices] = await pool.query<PriceRow[]>(
    `SELECT product_id, value, symbol, is_default
       FROM product_prices
      WHERE product_id IN (?)
      ORDER BY id`,
    [products.map((p) => p.id)],
  );

  const pricesByProduct = new Map<number, Price[]>();
  for (const row of prices) {
    const list = pricesByProduct.get(row.product_id) ?? [];
    list.push({ value: row.value, symbol: row.symbol, isDefault: row.is_default === 1 });
    pricesByProduct.set(row.product_id, list);
  }

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
    price: pricesByProduct.get(p.id) ?? [],
    order: { id: p.order_id, title: p.order_title },
    date: p.created_at.toISOString(),
  }));
}

export async function getProductTypes(): Promise<string[]> {
  const [rows] = await pool.query<TypeRow[]>('SELECT DISTINCT type FROM products ORDER BY type');
  return rows.map((row) => row.type);
}
