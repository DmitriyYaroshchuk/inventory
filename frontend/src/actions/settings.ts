'use server';

import { revalidatePath } from 'next/cache';
import { requestWithAuth } from '@/lib/auth';

export const updateNameAction = async (name: string): Promise<boolean> => {
  const response = await requestWithAuth('/auth/me', 'PATCH', { name });

  if (response.ok) revalidatePath('/', 'layout');
  return response.ok;
};

export const changePasswordAction = async (
  currentPassword: string,
  newPassword: string,
): Promise<'wrongPassword' | 'unknown' | null> => {
  const response = await requestWithAuth('/auth/password', 'POST', {
    currentPassword,
    newPassword,
  });

  if (response.ok) return null;
  return response.status === 403 ? 'wrongPassword' : 'unknown';
};
