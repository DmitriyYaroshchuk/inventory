import { cookies } from 'next/headers';
import { DEFAULT_THEME, isTheme, THEME_COOKIE, type Theme } from '@/lib/theme';

export const getTheme = async (): Promise<Theme> => {
  const cookieStore = await cookies();
  const saved = cookieStore.get(THEME_COOKIE)?.value;
  return isTheme(saved) ? saved : DEFAULT_THEME;
};
