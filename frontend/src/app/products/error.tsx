'use client';
import { useTranslations } from 'next-intl';

const ProductError = () => {
  const t = useTranslations('products');

  return (
    <div className="alert alert-danger" role="alert">
      {t('loadError')}
    </div>
  );
};
export default ProductError;
