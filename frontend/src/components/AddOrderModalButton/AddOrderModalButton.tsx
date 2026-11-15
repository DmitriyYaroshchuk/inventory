'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hooks';

const AddOrderModal = dynamic(() => import('@/components/AddOrderModal/AddOrderModal'), {
  ssr: false,
});

const AddOrderModalButton = () => {
  const router = useRouter();
  const t = useTranslations('orders');
  const token = useAppSelector((state) => state.auth.token);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <button className="orders__add" type="button" aria-label={t('add')} onClick={handleClick}>
        +
      </button>

      {isOpen && (
        <AddOrderModal onClose={() => setIsOpen(false)} onSuccess={() => router.refresh()} />
      )}
    </>
  );
};
export default AddOrderModalButton;
