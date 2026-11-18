'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiSend } from '@/services/server-api';
import { getAuthToken } from '@/lib/auth';

const sendWithAuth = async (path: string, method: 'POST' | 'DELETE', body?: unknown) => {
  const token = await getAuthToken();
  if (!token) redirect('/login');

  const response = await apiSend(path, { method, body, token });
  if (response.status === 401) redirect('/login');

  return response.ok;
};

export const createOrderAction = async (title: string, description: string): Promise<boolean> => {
  const isSuccess = await sendWithAuth('/orders', 'POST', { title, description });
  if (isSuccess) revalidatePath('/orders');
  return isSuccess;
};

export const deleteOrderAction = async (id: number): Promise<boolean> => {
  const isSuccess = await sendWithAuth(`/orders/${id}`, 'DELETE');
  if (isSuccess) revalidatePath('/orders');
  return isSuccess;
};
