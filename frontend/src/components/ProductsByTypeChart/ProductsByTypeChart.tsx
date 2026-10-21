'use client';

import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { pluralize } from '@/utils/format';
import type { TypeCountPoint } from '@/utils/statistics';

const COLORS = ['#7ab648', '#4fc3f7', '#ffb74d', '#ba68c8', '#e57373', '#90a4ae'];

type ProductsByTypeChartProps = {
    data: TypeCountPoint[];
};

const ProductsByTypeChart = ({ data }: ProductsByTypeChartProps) => {
    const coloredData = data.map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length],
    }));
    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie
                    data={coloredData}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={2}
                />
                <Tooltip
                    formatter={(value, name) => {
                        const count = Number(value);
                        return [`${count} ${pluralize(count, ['продукт', 'продукта', 'продуктов'])}`, name];
                    }}
                />
                <Legend position="right" layout="vertical" />
            </PieChart>
        </ResponsiveContainer>
    );
}
export default ProductsByTypeChart;