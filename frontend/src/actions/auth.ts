'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { apiSend } from '@/services/server-api';
import { deleteAuthToken, setAuthToken } from '@/lib/auth';
import type { AuthResponse } from '@/types';

type AuthError = 'invalidCredentials' | 'emailTaken' | 'unknown';

export const loginAction = async (email: string, password: string): Promise<AuthError> => {
  const response = await apiSend('/auth/login', { method: 'POST', body: { email, password } });

  if (!response.ok) {
    return response.status === 401 ? 'invalidCredentials' : 'unknown';
  }

  const { token }: AuthResponse = await response.json();
  await setAuthToken(token);
  redirect('/orders');
};

export const registerAction = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthError> => {
  const response = await apiSend('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });

  if (!response.ok) {
    return response.status === 409 ? 'emailTaken' : 'unknown';
  }

  const { token }: AuthResponse = await response.json();
  await setAuthToken(token);
  redirect('/orders');
};

export const logoutAction = async () => {
  await deleteAuthToken();
  revalidatePath('/', 'layout');
};
