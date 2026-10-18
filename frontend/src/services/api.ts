import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { OrderDetails, OrderSummary, Product } from '@/types';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
  }),
  tagTypes: ['Orders', 'Products'],

  endpoints: (build) => ({
    getOrders: build.query<OrderSummary[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),

    getOrder: build.query<OrderDetails, number>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),

    deleteOrder: build.mutation<void, number>({
      query: (id) => ({ url: `/orders/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Orders', 'Products'],
    }),

    createOrder: build.mutation<OrderDetails, { title: string; description: string }>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),

    getProducts: build.query<Product[], string | void>({
      query: (type) => (type ? `/products?type=${encodeURIComponent(type)}` : '/products'),
      providesTags: ['Products'],
    }),

    getProductTypes: build.query<string[], void>({
      query: () => '/products/types',
      providesTags: ['Products'],
    }),

  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useDeleteOrderMutation,
  useCreateOrderMutation,
  useGetProductsQuery,
  useGetProductTypesQuery,
} = api;
