'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useDeleteOrderMutation, useGetOrdersQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectOrder } from '@/store/ordersSlice';
import type { OrderSummary } from '@/types';
import OrderItem from '@/components/OrderItem/OrderItem';
import Loader from '@/components/Loader/Loader';
import './Orders.scss';

const OrderDetails = dynamic(() => import('@/components/OrderDetails/OrderDetails'), {
  loading: () => <Loader />,
});

const DeleteOrderModal = dynamic(() => import('@/components/DeleteOrderModal/DeleteOrderModal'), {
  ssr: false,
});

const AddOrderModal = dynamic(() => import('@/components/AddOrderModal/AddOrderModal'), {
  ssr: false,
});

const Orders = () => {
  const dispatch = useAppDispatch();
  const selectedOrderId = useAppSelector((state) => state.orders.selectedOrderId);
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  const router = useRouter();
  const t = useTranslations('orders');
  const token = useAppSelector((state) => state.auth.token);

  const [deleteOrder, { isLoading: isDeleting, isError: isDeleteError, reset }] =
    useDeleteOrderMutation();
  const [orderToDelete, setOrderToDelete] = useState<OrderSummary | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleCancelDelete = () => {
    setOrderToDelete(null);
    reset();
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await deleteOrder(orderToDelete.id).unwrap();

      if (orderToDelete.id === selectedOrderId) {
        dispatch(selectOrder(null));
      }
      setOrderToDelete(null);
    } catch (error) {
      console.error('Не удалось удалить приход', error);
    }
  };

  const handleOpen = (id: number) => {
    dispatch(selectOrder(id === selectedOrderId ? null : id));
  };

  const handleAddClick = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAddOpen(true);
  };

  const handleDeleteClick = (order: OrderSummary) => {
    if (!token) {
      router.push('/login');
      return;
    }
    setOrderToDelete(order);
  };

  const isOpen = selectedOrderId !== null;

  return (
    <section className="orders">
      <div className="orders__header">
        <button
          className="orders__add"
          type="button"
          aria-label={t('add')}
          onClick={handleAddClick}
        >
          +
        </button>
        <h1 className="orders__title">{t('title', { count: orders.length })}</h1>
      </div>

      {isLoading && <Loader />}

      {isError && (
        <div className="alert alert-danger" role="alert">
          {t('loadError')}
        </div>
      )}

      {!isLoading && !isError && orders.length === 0 && <p className="text-muted">{t('empty')}</p>}

      {orders.length > 0 && (
        <div className={`orders__body${isOpen ? ' orders__body--open' : ''}`}>
          <ul className="orders__list">
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                isCompact={isOpen}
                isActive={order.id === selectedOrderId}
                onOpen={() => handleOpen(order.id)}
                onDelete={() => handleDeleteClick(order)}
              />
            ))}
          </ul>

          {isOpen && <OrderDetails key={selectedOrderId} orderId={selectedOrderId} />}
        </div>
      )}

      {orderToDelete && (
        <DeleteOrderModal
          order={orderToDelete}
          isDeleting={isDeleting}
          isError={isDeleteError}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isAddOpen && <AddOrderModal onClose={() => setIsAddOpen(false)} />}
    </section>
  );
};

export default Orders;
