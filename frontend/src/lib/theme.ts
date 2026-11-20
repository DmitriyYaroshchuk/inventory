export const THEMES = ['light', 'dark', 'auto'] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'auto';

export const THEME_COOKIE = 'theme';

export const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);
