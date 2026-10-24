const PRODUCT_TYPE_KEY = 'inventory:productType';
const TOKEN_KEY = 'inventory:token';

export const loadProductTypeFromLS = (): string => {
    try {
        return localStorage.getItem(PRODUCT_TYPE_KEY) ?? '';
    } catch {
        return '';
    }
}

export const saveProductTypeToLS = (type: string) => {
    try {
        if (type) {
            localStorage.setItem(PRODUCT_TYPE_KEY, type);
        } else {
            localStorage.removeItem(PRODUCT_TYPE_KEY);
        }
    } catch (error) {
        console.warn('Не удалось сохранить фильтр в localStorage:', error);
    }
}

export const loadTokenFromLS = (): string | null => {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

export const saveTokeenToLS = (token: string | null) => {
    try {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    } catch (error) {
        console.warn('Не удалось сохранить токен в localStorage:', error);
    }
}