import { cookies } from 'next/headers';
import { apiGet } from '@/services/server-api';
import type { User } from '@/types';

const AUTH_COOKIE = 'inventory-token';
const MAX_AGE = 60 * 60 * 24 * 7;

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? null;
};

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
};

export const deleteAuthToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = await getAuthToken();
  if (!token) return null;

  return apiGet<User>('/auth/me', token).catch(() => null);
};
