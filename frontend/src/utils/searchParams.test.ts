import { describe, expect, it } from 'vitest';
import { parseId } from './searchParams';

describe('parseId', () => {
  it('returns a number for a valid id', () => {
    expect(parseId('5')).toBe(5);
  });

  it('returns null when id is missing', () => {
    expect(parseId(undefined)).toBeNull();
  });

  it('returns null for invalid values', () => {
    expect(parseId('abc')).toBeNull();
    expect(parseId('1.5')).toBeNull();
    expect(parseId('-1')).toBeNull();
    expect(parseId('0')).toBeNull();
  });

  it('returns null when the param is repeated', () => {
    expect(parseId(['1', '2'])).toBeNull();
  });
});
