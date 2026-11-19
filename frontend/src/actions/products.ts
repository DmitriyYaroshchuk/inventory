'use server';

import { revalidatePath } from 'next/cache';
import { sendWithAuth } from '@/lib/auth';
import type { NewProduct } from '@/types';

const revalidateProducts = () => {
  revalidatePath('/products');
  revalidatePath('/orders');
};

export const createProductAction = async (product: NewProduct): Promise<boolean> => {
  const isSuccess = await sendWithAuth('/products', 'POST', product);
  if (isSuccess) revalidateProducts();
  return isSuccess;
};

export const deleteProductAction = async (id: number): Promise<boolean> => {
  const isSuccess = await sendWithAuth(`/products/${id}`, 'DELETE');
  if (isSuccess) revalidateProducts();
  return isSuccess;
};
