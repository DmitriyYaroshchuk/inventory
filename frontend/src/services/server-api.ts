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

export const fetchProducts = (type?: string) => {
  return apiGet<Product[]>(type ? `/products?type=${encodeURIComponent(type)}` : '/products');
};

export const fetchProductsTypes = () => {
  return apiGet<string[]>('/products/types');
};

export const fetchOrders = () => {
  return apiGet<OrderSummary[]>('/orders');
};

export const fetchOrder = (id: number) => {
  return apiGet<OrderDetails>(`/orders/${id}`);
};
