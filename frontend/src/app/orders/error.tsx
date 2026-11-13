'use client';

import { useTranslations } from 'next-intl';

const OrdersError = () => {
  const t = useTranslations('orders');

  return (
    <div className="alert alert-danger" role="alert">
      {t('loadError')}
    </div>
  );
};

export default OrdersError;
