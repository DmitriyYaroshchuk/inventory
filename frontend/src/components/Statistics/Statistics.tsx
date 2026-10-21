'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useGetOrdersQuery, useGetProductsQuery } from '@/services/api';
import { countProductsByType, getOrderTotals } from '@/utils/statistics';
import Loader from '@/components/Loader/Loader';
import './Statistics.scss';

const OrdersTotalChart = dynamic(
    () => import('@/components/OrdersTotalChart/OrdersTotalChart'),
    { ssr: false, loading: () => <Loader /> },
);

const ProductsByTypeChart = dynamic(
    () => import('@/components/ProductsByTypeChart/ProductsByTypeChart'),
    { ssr: false, loading: () => <Loader /> },
);

const Statistics = () => {
    const { data: orders = [], isLoading, isError } = useGetOrdersQuery();
    const orderTotals = useMemo(() => getOrderTotals(orders), [orders]);

    const { data: products = [] } = useGetProductsQuery();
    const productsByType = useMemo(() => countProductsByType(products), [products]);

    return (
        <section className="statistics">
            <h1 className="statistics__title">Статистика</h1>

            {isLoading && <Loader />}
            {isError && (
                <div className="alert alert-danger" role="alert">
                    Не удалось загрузить данные. Проверьте, что сервер запущен.
                </div>
            )}

            <div className='statistics__grid'>
                {orderTotals.length > 0 && (
                    <div className="statistics__card">
                        <h2 className="statistics__subtitle">Сумма приходов, UAH</h2>
                        <OrdersTotalChart data={orderTotals} />
                    </div>
                )}

                {productsByType.length > 0 && (
                    <div className="statistics__card">
                        <h2 className="statistics__subtitle">Продукты по типам</h2>
                        <ProductsByTypeChart data={productsByType} />
                    </div>
                )}
            </div>

        </section>
    );
};

export default Statistics;