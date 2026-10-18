const PRODUCT_TYPE_KEY = 'inventory:productType';

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