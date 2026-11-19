'use server';

import { revalidatePath } from 'next/cache';
import { sendWithAuth } from '@/lib/auth';

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
