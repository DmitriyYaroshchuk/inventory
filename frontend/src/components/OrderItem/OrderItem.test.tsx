import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { OrderSummary } from '@/types';
import { renderWithIntl } from '@/test-utils';
import OrderItem from './OrderItem';

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

const renderItem = ({ isCompact = false, isActive = false } = {}) => {
  const onOpen = vi.fn();
  const onDelete = vi.fn();

  renderWithIntl(
    <ul>
      <OrderItem
        order={order}
        isCompact={isCompact}
        isActive={isActive}
        onOpen={onOpen}
        onDelete={onDelete}
      />
    </ul>,
  );

  return {
    onOpen,
    onDelete,
  };
};

describe('OrderItem', () => {
  it('shows order title, products count and dates', () => {
    renderItem();

    expect(screen.getByRole('button', { name: 'Приход 1: мониторы' })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Продуктов')).toBeInTheDocument();
    expect(screen.getByText('29 / 06')).toBeInTheDocument();
    expect(screen.getByText('29 / Июн / 2017')).toBeInTheDocument();
    expect(screen.getByText('875 $')).toBeInTheDocument();
  });

  it('calls onOpen when the titles is clicked', async () => {
    const user = userEvent.setup();
    const { onOpen } = renderItem();

    await user.click(screen.getByRole('button', { name: 'Приход 1: мониторы' }));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onOpen when the list icon is clicked', async () => {
    const user = userEvent.setup();
    const { onOpen } = renderItem();

    await user.click(screen.getByRole('button', { name: 'Показать продукты прихода' }));

    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete (not open) when the trash icon is clicked', async () => {
    const user = userEvent.setup();
    const { onOpen, onDelete } = renderItem();

    await user.click(screen.getByRole('button', { name: 'Удалить приход' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('hides title and delete button in compact mode', () => {
    renderItem({ isCompact: true });

    expect(screen.queryByRole('button', { name: 'Приход 1: мониторы' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Удалить приход' })).not.toBeInTheDocument();
    expect(screen.getByText('Продуктов')).toBeInTheDocument();
  });

  it('marks the active order', () => {
    renderItem({ isActive: true });

    expect(screen.getByRole('listitem')).toHaveClass('order-item--active');
  });
});
