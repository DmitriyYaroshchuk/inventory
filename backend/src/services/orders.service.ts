import type { ResultSetHeader, RowDataPacket } from 'mysql2';
import { pool } from '../db';
import type { OrderDetails, OrderSummary, Price, ProductDto } from '../types';
import { getProducts } from './products.service';

interface OrderRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  date: Date;
}

const round2 = (n: number): number => Math.round(n * 100) / 100;

function sumPrices(products: ProductDto[]): Price[] {
  const sums = new Map<string, Price>();
  for (const product of products) {
    for (const price of product.price) {
      const current = sums.get(price.symbol);
      if (current) current.value = round2(current.value + price.value);
      else sums.set(price.symbol, { ...price, value: round2(price.value) });
    }
  }
  return [...sums.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
}

async function fetchOrders(orderId?: number): Promise<OrderDetails[]> {
  const where = orderId !== undefined ? 'WHERE id = ?' : '';
  const params = orderId !== undefined ? [orderId] : [];

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
}

export async function listOrders(): Promise<OrderSummary[]> {
  const orders = await fetchOrders();
  return orders.map(({ products: _products, ...summary }) => summary);
}

export async function getOrder(id: number): Promise<OrderDetails | null> {
  const [order] = await fetchOrders(id);
  return order ?? null;
}

export async function deleteOrder(id: number): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
