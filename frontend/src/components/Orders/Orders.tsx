'use client';

import { useGetOrdersQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectOrder } from '@/store/ordersSlice';
import OrderItem from '@/components/OrderItem/OrderItem';
import OrderDetails from '@/components/OrderDetails/OrderDetails';
import './Orders.scss';

const Orders = () => {
    const dispatch = useAppDispatch();
    const selectedOrderId = useAppSelector((state) => state.orders.selectedOrderId);
    const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

    const handleOpen = (id: number) => {
        dispatch(selectOrder(id === selectedOrderId ? null : id));
    }

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Не удалось загрузить приходы</p>;

    const isOpen = selectedOrderId !== null;

    return (
        <section className="orders">
            <div className="orders__header">
                <button className="orders__add" type="button" aria-label="Добавить приход">
                    +
                </button>
                <h1 className="orders__title">Приходы / {orders.length}</h1>
            </div>

            <div className={`orders__body${isOpen ? ' orders__body--open' : ''}`}>
                <ul className="orders__list">
                    {orders.map((order) => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            isCompact={isOpen}
                            isActive={order.id === selectedOrderId}
                            onOpen={() => handleOpen(order.id)}
                        />
                    ))}
                </ul>

                {selectedOrderId !== null && <OrderDetails orderId={selectedOrderId} />}
            </div>
        </section>
    )
}
export default Orders;