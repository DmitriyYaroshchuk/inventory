'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('statistics');

    const { data: orders = [], isLoading: isOrdersLoading, isError: isOrdersError } = useGetOrdersQuery();
    const orderTotals = useMemo(() => getOrderTotals(orders), [orders]);

    const { data: products = [], isLoading: isProductsLoading, isError: isProductsError } = useGetProductsQuery();
    const productsByType = useMemo(() => countProductsByType(products), [products]);

    const isLoading = isOrdersLoading || isProductsLoading;
    const isError = isOrdersError || isProductsError;

    return (
        <section className="statistics">
            <h1 className="statistics__title">{t('title')}</h1>

            {isLoading && <Loader />}
            {isError && (
                <div className="alert alert-danger" role="alert">
                    {t('loadError')}
                </div>
            )}

            <div className='statistics__grid'>
                {orderTotals.length > 0 && (
                    <div className="statistics__card">
                        <h2 className="statistics__subtitle">{t('ordersTotal')}</h2>
                        <OrdersTotalChart data={orderTotals} />
                    </div>
                )}

                {productsByType.length > 0 && (
                    <div className="statistics__card">
                        <h2 className="statistics__subtitle">{t('productsByType')}</h2>
                        <ProductsByTypeChart data={productsByType} />
                    </div>
                )}
            </div>

        </section>
    );
};

export default Statistics;