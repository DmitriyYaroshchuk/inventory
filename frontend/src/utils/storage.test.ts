import { beforeEach, describe, expect, it } from 'vitest';
import { loadProductTypeFromLS, saveProductTypeToLS } from './storage';

const KEY = 'inventory:productType';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty string when nothing is saved', () => {
    expect(loadProductTypeFromLS()).toBe('');
  });

  it('saves the product type and loads it back', () => {
    saveProductTypeToLS('Monitors');

    expect(localStorage.getItem(KEY)).toBe('Monitors');
    expect(loadProductTypeFromLS()).toBe('Monitors');
  });

  it('removes the key when "all types" is selected', () => {
    saveProductTypeToLS('Monitors');
    saveProductTypeToLS('');

    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
