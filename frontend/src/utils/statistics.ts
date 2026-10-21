import type { OrderSummary, Product } from '@/types';
import { getPrice } from './format';

export type OrderTotalPoint = {
    name: string;
    total: number;
};

export type TypeCountPoint = {
    type: string;
    count: number;
};

export const getOrderTotals = (orders: OrderSummary[]): OrderTotalPoint[] => {

    return orders.map((order) => ({
        name: order.title,
        total: getPrice(order.total, 'UAH')
    }));
}

export const countProductsByType = (products: Product[]): TypeCountPoint[] => {
    const counts = new Map<string, number>();

    products.forEach(({ type }) => {
        counts.set(type, (counts.get(type) ?? 0) + 1);
    });

    return [...counts].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);
}