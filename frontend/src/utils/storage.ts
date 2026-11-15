const TOKEN_KEY = 'inventory:token';

export const loadTokenFromLS = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveTokenToLS = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.warn('Не удалось сохранить токен в localStorage:', error);
  }
};
