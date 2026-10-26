import type { RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { Price, ProductDto } from '../types';

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

function parsePrices(raw: RawPrice[] | string): Price[] {
  const list: RawPrice[] = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return list.map((x) => ({
    value: Number(x.value),
    symbol: x.symbol,
    isDefault: Boolean(x.isDefault),
  }));
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
}

export async function getProductTypes(): Promise<string[]> {
  const [rows] = await pool.query<TypeRow[]>('SELECT DISTINCT type FROM products ORDER BY type');
  return rows.map((row) => row.type);
}
