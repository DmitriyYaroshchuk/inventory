import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { API_URL } from '@/services/api';
import type { OrderDetails, OrderSummary, Product } from '@/types';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal';

type DeleteOrderModalProps = {
  order: OrderSummary;
  isDeleting: boolean;
  isError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteOrderModal = ({ order, ...modalProps }: DeleteOrderModalProps) => {
  const t = useTranslations('deleteOrder');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/orders/${order.id}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((details: OrderDetails | null) => setProducts(details?.products ?? []))
      .catch(() => {});

    return () => controller.abort();
  }, [order.id]);

  return (
    <ConfirmDeleteModal
      title={t('title')}
      errorText={t('error')}
      products={products}
      {...modalProps}
    />
  );
};

export default DeleteOrderModal;
