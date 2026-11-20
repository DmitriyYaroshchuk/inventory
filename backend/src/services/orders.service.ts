import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { OrderDetails, OrderSummary } from '../types';
import { sumPrices } from '../utils';
import { getProducts } from './products.service';

interface OrderRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  date: Date;
}

const fetchOrders = async (orderId?: number, search?: string): Promise<OrderDetails[]> => {
  const conditions: string[] = [];
  const params: Array<string | number> = [];

  if (orderId !== undefined) {
    conditions.push('id = ?');
    params.push(orderId);
  }
  if (search) {
    conditions.push('title LIKE ?');
    params.push(`%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [orders] = await pool.query<OrderRow[]>(
    `SELECT id, title, description, date FROM orders ${where} ORDER BY date DESC, id DESC`,
    params,
  );
  if (orders.length === 0) return [];

  const products = await getProducts(orderId !== undefined ? { orderId } : {});

  return orders.map((o) => {
    const own = products.filter((p) => p.order.id === o.id);
    return {
      id: o.id,
      title: o.title,
      description: o.description,
      date: o.date.toISOString(),
      productsCount: own.length,
      total: sumPrices(own),
      products: own,
    };
  });
};

export const listOrders = async (search?: string): Promise<OrderSummary[]> => {
  const orders = await fetchOrders(undefined, search);
  return orders.map(({ products: _products, ...summary }) => summary);
};

export const getOrder = async (id: number): Promise<OrderDetails | null> => {
  const [order] = await fetchOrders(id);
  return order ?? null;
};

export const deleteOrder = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

export const createOrder = async (
  title: string,
  description: string | null,
): Promise<OrderDetails | null> => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO orders (title, description) VALUES (?, ?)',
    [title, description],
  );
  return getOrder(result.insertId);
};
