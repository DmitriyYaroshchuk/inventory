'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const AddProductModal = dynamic(() => import('@/components/AddProductModal/AddProductModal'), {
  ssr: false,
});

type AddProductButtonProps = {
  orderId: number;
  types: string[];
  isAuthenticated: boolean;
};

const AddProductButton = ({ orderId, types, isAuthenticated }: AddProductButtonProps) => {
  const router = useRouter();
  const t = useTranslations('orderDetails');
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button className="order-details__add" type="button" onClick={handleClick}>
        <span className="order-details__add-icon">+</span>
        {t('addProduct')}
      </button>

      {isOpen && (
        <AddProductModal orderId={orderId} types={types} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
};

export default AddProductButton;
