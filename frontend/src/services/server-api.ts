import { API_URL } from '@/services/api';
import type { OrderDetails, OrderSummary, Product } from '@/types';

export const apiGet = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}/api${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${path}`);
  }

  return response.json();
};

const withQuery = (path: string, query: Record<string, string | undefined>) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  const queryString = params.toString();
  return queryString ? `${path}?${queryString}` : path;
};

export const fetchProducts = (type?: string, q?: string) => {
  return apiGet<Product[]>(withQuery('/products', { type, q }));
};

export const fetchProductsTypes = () => {
  return apiGet<string[]>('/products/types');
};

export const fetchOrders = (q?: string) => {
  return apiGet<OrderSummary[]>(withQuery('/orders', { q }));
};

export const fetchOrder = (id: number) => {
  return apiGet<OrderDetails>(`/orders/${id}`);
};
