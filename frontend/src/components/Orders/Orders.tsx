'use client';

import { useGetOrdersQuery } from "@/services/api";
import OrderItem from "../OrderItem/OrderItem";

const Orders = () => {
    const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

    if (isLoading) return <p>Загрузка...</p>;
    if (isError) return <p>Не удалось загрузить приходы</p>;

    return (
        <section className="orders">
            <h1 className="orders__title">Приходы / {orders.length}</h1>

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