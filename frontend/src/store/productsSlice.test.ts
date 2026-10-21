import { describe, expect, it } from 'vitest';
import productsReducer, { setProductType } from './productsSlice';

describe('productsSlice', () => {
    it('shows all types initially', () => {
        const state = productsReducer(undefined, { type: 'unknown' });

        expect(state.productType).toBe('');
    });

    it('sets the product type', () => {
        const state = productsReducer(undefined, setProductType('Monitors'));

        expect(state.productType).toBe('Monitors');
    });

    it('resets the filter to all types', () => {
        const state = productsReducer({ productType: 'Monitors' }, setProductType(''));

        expect(state.productType).toBe('');
    });
})