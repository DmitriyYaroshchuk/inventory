'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMoney } from '@/utils/format';
import type { OrderTotalPoint } from '@/utils/statistics';


const BAR_COLOR = '#7ab648';
const MAX_LABEL_LENGTH = 18;

type OrdersTotalChartProps = {
    data: OrderTotalPoint[];
};

const shortenLabel = (lable: string) => {
    return lable.length > MAX_LABEL_LENGTH ? `${lable.slice(0, MAX_LABEL_LENGTH)}...` : lable;
}

const OrdersTotalChart = ({ data }: OrdersTotalChartProps) => {
    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickFormatter={shortenLabel} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value: number) => formatMoney(value)} width={80} />
                <Tooltip
                    cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                    formatter={(value) => [`${formatMoney(Number(value))} UAH`, 'Сумма']}
                />
                <Bar dataKey="total" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={80} />
            </BarChart>
        </ResponsiveContainer>
    )
}
export default OrdersTotalChart;