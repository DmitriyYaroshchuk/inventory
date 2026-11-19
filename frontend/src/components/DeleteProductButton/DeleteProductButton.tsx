'use client';

import { useState, useTransition } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { deleteProductAction } from '@/actions/products';
import type { Product } from '@/types';

const ConfirmDeleteModal = dynamic(
  () => import('@/components/ConfirmDeleteModal/ConfirmDeleteModal'),
  { ssr: false },
);

type DeleteProductButtonProps = {
  product: Product;
  isAuthenticated: boolean;
  className: string;
};

const DeleteProductButton = ({ product, isAuthenticated, className }: DeleteProductButtonProps) => {
  const router = useRouter();
  const t = useTranslations('deleteProduct');
  const tCommon = useTranslations('common');

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsError(false);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      const isSuccess = await deleteProductAction(product.id);
      if (!isSuccess) {
        setIsError(true);
        return;
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        className={className}
        type="button"
        aria-label={tCommon('deleteProduct')}
        onClick={handleClick}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <path d="M6 2h4l1 1h3v2H2V3h3l1-1zM3 6h10l-1 8H4L3 6z" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <ConfirmDeleteModal
          title={t('title')}
          errorText={t('error')}
          products={[product]}
          isDeleting={isPending}
          isError={isError}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export default DeleteProductButton;
