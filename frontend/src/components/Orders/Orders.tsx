'use client';

import { useGetOrdersQuery } from "@/services/api";
import OrderItem from "../OrderItem/OrderItem";
import './Orders.scss';

const Orders = () => {
    const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Не удалось загрузить приходы</p>;

    return (
        <section className="orders">
            <div className="orders__header">
                <button className="orders__add" type="button" aria-label="Добавить приход">
                    +
                </button>
                <h1 className="orders__title">Приходы / {orders.length}</h1>
            </div>

            <ul className="orders__list">
                {
                    orders.map((order) => (
                        <OrderItem key={order.id} order={order} />
                    ))
                }
            </ul>
        </section>
    )
}
export default Orders;