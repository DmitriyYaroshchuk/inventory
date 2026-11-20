import { API_URL } from '@/services/api';
import type { OrderDetails, OrderSummary, Product, ProductGroup } from '@/types';

const buildHeaders = (token?: string | null, hasBody = false) => {
  const headers = new Headers();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (hasBody) headers.set('Content-Type', 'application/json');
  return headers;
};

export const apiGet = async <T>(path: string, token?: string | null): Promise<T> => {
  const response = await fetch(`${API_URL}/api${path}`, {
    cache: 'no-store',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${path}`);
  }

  return response.json();
};

type SendOptions = {
  method: 'POST' | 'DELETE';
  body?: unknown;
  token?: string | null;
};

export const apiSend = (path: string, { method, body, token }: SendOptions) => {
  return fetch(`${API_URL}/api${path}`, {
    method,
    cache: 'no-store',
    headers: buildHeaders(token, body !== undefined),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
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

export const fetchProductGroups = () => {
  return apiGet<ProductGroup[]>('/products/groups');
};

export const fetchOrders = (q?: string) => {
  return apiGet<OrderSummary[]>(withQuery('/orders', { q }));
};

export const fetchOrder = (id: number) => {
  return apiGet<OrderDetails>(`/orders/${id}`);
};
