import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';
import { makeStore } from '@/store';
import type { OrderSummary } from '@/types';
import { renderWithIntl } from '@/test-utils';
import OrderItem from './OrderItem';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const order: OrderSummary = {
  id: 1,
  title: 'Приход 1: мониторы',
  description: null,
  date: '2017-06-29T12:00:00',
  productsCount: 5,
  total: [
    { value: 875, symbol: 'USD', isDefault: false },
    { value: 22750, symbol: 'UAH', isDefault: true },
  ],
};

const renderItem = ({ isCompact = false, isActive = false } = {}) =>
  renderWithIntl(
    <Provider store={makeStore()}>
      <ul>
        <OrderItem order={order} isCompact={isCompact} isActive={isActive} />
      </ul>
    </Provider>,
  );

describe('OrderItem', () => {
  it('shows order title, products count and dates', () => {
    renderItem();

    expect(screen.getByRole('link', { name: 'Приход 1: мониторы' })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Продуктов')).toBeInTheDocument();
    expect(screen.getByText('29 / 06')).toBeInTheDocument();
    expect(screen.getByText('29 / Июн / 2017')).toBeInTheDocument();
    expect(screen.getByText('875 $')).toBeInTheDocument();
  });

  it('links to the order details', () => {
    renderItem();

    expect(screen.getByRole('link', { name: 'Приход 1: мониторы' })).toHaveAttribute(
      'href',
      '/orders?id=1',
    );
    expect(screen.getByRole('link', { name: 'Показать продукты прихода' })).toHaveAttribute(
      'href',
      '/orders?id=1',
    );
  });

  it('links back to /orders when the order is already open', () => {
    renderItem({ isActive: true });

    expect(screen.getByRole('link', { name: 'Показать продукты прихода' })).toHaveAttribute(
      'href',
      '/orders',
    );
  });

  it('redirects to login when deleting without a token', async () => {
    const user = userEvent.setup();
    renderItem();

    await user.click(screen.getByRole('button', { name: 'Удалить приход' }));

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('hides title and delete button in compact mode', () => {
    renderItem({ isCompact: true });

    expect(screen.queryByRole('link', { name: 'Приход 1: мониторы' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить приход' })).not.toBeInTheDocument();
    expect(screen.getByText('Продуктов')).toBeInTheDocument();
  });

  it('marks the active order', () => {
    renderItem({ isActive: true });

    expect(screen.getByRole('listitem')).toHaveClass('order-item--active');
  });
});
