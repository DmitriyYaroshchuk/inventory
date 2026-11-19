import { getTranslations } from 'next-intl/server';
import { fetchOrder, fetchOrders, fetchProductsTypes } from '@/services/server-api';
import { getAuthToken } from '@/lib/auth';
import OrderItem from '@/components/OrderItem/OrderItem';
import OrderDetails from '@/components/OrderDetails/OrderDetails';
import AddOrderModalButton from '@/components/AddOrderModalButton/AddOrderModalButton';
import './Orders.scss';

type OrdersProps = {
  selectedOrderId: number | null;
  search: string;
};

const Orders = async ({ selectedOrderId, search }: OrdersProps) => {
  const t = await getTranslations('orders');

  const [orders, selectedOrder, types] = await Promise.all([
    fetchOrders(search || undefined),
    selectedOrderId ? fetchOrder(selectedOrderId).catch(() => null) : null,
    fetchProductsTypes(),
  ]);

  const isOpen = selectedOrder !== null;
  const isAuthenticated = (await getAuthToken()) !== null;

  return (
    <section className="orders">
      <div className="orders__header">
        <AddOrderModalButton isAuthenticated={isAuthenticated} />
        <h1 className="orders__title">{t('title', { count: orders.length })}</h1>
      </div>

      {orders.length === 0 && <p className="text-muted">{t('empty')}</p>}

      {orders.length > 0 && (
        <div className={`orders__body${isOpen ? ' orders__body--open' : ''}`}>
          <ul className="orders__list">
            {orders.map((order) => (
              <OrderItem
                key={order.id}
                order={order}
                isCompact={isOpen}
                isActive={order.id === selectedOrderId}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </ul>

          {selectedOrder && (
            <OrderDetails order={selectedOrder} types={types} isAuthenticated={isAuthenticated} />
          )}
        </div>
      )}
    </section>
  );
};

export default Orders;
