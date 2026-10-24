import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse, OrderDetails, OrderSummary, Product, User } from '@/types';
import type { RootState } from '@/store';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers
    },
  }),
  tagTypes: ['Orders', 'Products'],

  endpoints: (build) => ({
    getOrders: build.query<OrderSummary[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),

    getOrder: build.query<OrderDetails, number>({
      query: (id) => `/orders/${id}`,
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

    login: build.mutation<AuthResponse, { email: string, password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),

    register: build.mutation<AuthResponse, { name: string, email: string, password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body })
    }),

    getMe: build.query<User, string>({
      query: () => '/auth/me',
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
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = api;

