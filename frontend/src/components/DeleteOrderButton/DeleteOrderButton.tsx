'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useDeleteOrderMutation } from '@/services/api';
import { useAppSelector } from '@/store/hooks';
import type { OrderSummary } from '@/types';

const DeleteOrderModal = dynamic(() => import('@/components/DeleteOrderModal/DeleteOrderModal'), {
  ssr: false,
});

type DeleteOrderButtonProps = {
  order: OrderSummary;
};

const DeleteOrderButton = ({ order }: DeleteOrderButtonProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('orders');
  const token = useAppSelector((state) => state.auth.token);

  const [isOpen, setIsOpen] = useState(false);
  const [deleteOrderm, { isLoading, isError, reset }] = useDeleteOrderMutation();

  const handleClick = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    reset();
  };

  const handleConfirm = async () => {
    try {
      await deleteOrderm(order.id).unwrap();
      setIsOpen(false);

      if (searchParams.get('id') === String(order.id)) {
        router.push('/orders');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete order:', error);
    }
  };

  return (
    <>
      <button
        className="order-item__delete"
        type="button"
        aria-label={t('delete')}
        onClick={handleClick}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M6 2h4l1 1h3v2H2V3h3l1-1zM3 6h10l-1 8H4L3 6z" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <DeleteOrderModal
          order={order}
          isDeleting={isLoading}
          isError={isError}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};
export default DeleteOrderButton;
