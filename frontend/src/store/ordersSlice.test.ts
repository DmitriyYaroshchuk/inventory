import { describe, expect, it } from 'vitest';
import ordersReducer, { selectOrder } from './ordersSlice';

describe('ordersSlice', () => {
  it('has no selected order initially', () => {
    const state = ordersReducer(undefined, { type: 'unknown' });

    expect(state.selectedOrderId).toBeNull();
  });

  it('selects an order by id', () => {
    const state = ordersReducer(undefined, selectOrder(5));

    expect(state.selectedOrderId).toBe(5);
  });

  it('switches selection to another order', () => {
    const state = ordersReducer({ selectedOrderId: 5 }, selectOrder(7));

    expect(state.selectedOrderId).toBe(7);
  });

  it('clears the selection', () => {
    const state = ordersReducer({ selectedOrderId: 5 }, selectOrder(null));

    expect(state.selectedOrderId).toBeNull();
  });
});
