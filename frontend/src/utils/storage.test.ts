import { beforeEach, describe, expect, it } from 'vitest';
import { loadTokenFromLS, saveTokenToLS } from './storage';

const KEY = 'inventory:token';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no token is saved', () => {
    expect(loadTokenFromLS()).toBeNull();
  });

  it('saves the token and loads it back', () => {
    saveTokenToLS('abc');

    expect(localStorage.getItem(KEY)).toBe('abc');
    expect(loadTokenFromLS()).toBe('abc');
  });

  it('removes the token on logout', () => {
    saveTokenToLS('abc');
    saveTokenToLS(null);

    expect(localStorage.getItem(KEY)).toBeNull();
  });
});
