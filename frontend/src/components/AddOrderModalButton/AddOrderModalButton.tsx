'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

const AddOrderModal = dynamic(() => import('@/components/AddOrderModal/AddOrderModal'), {
  ssr: false,
});

type AddOrderModalButtonProps = {
  isAuthenticated: boolean;
};

const AddOrderModalButton = ({ isAuthenticated }: AddOrderModalButtonProps) => {
  const router = useRouter();
  const t = useTranslations('orders');
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
      <button className="orders__add" type="button" aria-label={t('add')} onClick={handleClick}>
        +
      </button>

      {isOpen && <AddOrderModal onClose={() => setIsOpen(false)} />}
    </>
  );
};
export default AddOrderModalButton;
