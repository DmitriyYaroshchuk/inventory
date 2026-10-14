import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { OrderDetails, OrderSummary, Price } from '../types';
import { getProducts } from './products.service';

interface OrderRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  created_at: Date;
  products_count: number;
}

interface TotalRow extends RowDataPacket {
  order_id: number;
  symbol: string;
  value: number;
  is_default: number;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

async function fetchSummaries(orderId?: number): Promise<OrderSummary[]> {
  const where = orderId !== undefined ? 'WHERE o.id = ?' : '';
  const params = orderId !== undefined ? [orderId] : [];

  const [orders] = await pool.query<OrderRow[]>(
    `SELECT o.id, o.title, o.description, o.created_at,
            (SELECT COUNT(*) FROM products p WHERE p.order_id = o.id) AS products_count
       FROM orders o
       ${where}
      ORDER BY o.created_at DESC, o.id DESC`,
    params,
  );

  if (orders.length === 0) return [];

  const [totals] = await pool.query<TotalRow[]>(
    `SELECT p.order_id, pp.symbol, SUM(pp.value) AS value, MAX(pp.is_default) AS is_default
       FROM product_prices pp
       JOIN products p ON p.id = pp.product_id
      WHERE p.order_id IN (?)
      GROUP BY p.order_id, pp.symbol
      ORDER BY pp.symbol`,
    [orders.map((o) => o.id)],
  );

  const totalsByOrder = new Map<number, Price[]>();
  for (const row of totals) {
    const list = totalsByOrder.get(row.order_id) ?? [];
    list.push({ value: round2(Number(row.value)), symbol: row.symbol, isDefault: Number(row.is_default) === 1 });
    totalsByOrder.set(row.order_id, list);
  }

  return orders.map((o) => ({
    id: o.id,
    title: o.title,
    description: o.description,
    date: o.created_at.toISOString(),
    productsCount: Number(o.products_count),
    total: totalsByOrder.get(o.id) ?? [],
  }));
}

export function listOrders(): Promise<OrderSummary[]> {
  return fetchSummaries();
}

export async function getOrder(id: number): Promise<OrderDetails | null> {
  const [summary] = await fetchSummaries(id);
  if (!summary) return null;

  const products = await getProducts({ orderId: id });
  return { ...summary, products };
}

/** Удаляет приход вместе с его продуктами и ценами (ON DELETE CASCADE). */
export async function deleteOrder(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
