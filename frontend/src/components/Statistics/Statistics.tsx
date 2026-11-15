import { getTranslations } from 'next-intl/server';
import { fetchOrders, fetchProducts } from '@/services/server-api';
import { countProductsByType, getOrderTotals } from '@/utils/statistics';
import OrdersTotalChart from '@/components/OrdersTotalChart/OrdersTotalChart';
import ProductsByTypeChart from '@/components/ProductsByTypeChart/ProductsByTypeChart';
import './Statistics.scss';

const Statistics = async () => {
  const t = await getTranslations('statistics');

  const [orders, products] = await Promise.all([fetchOrders(), fetchProducts()]);

  const orderTotals = getOrderTotals(orders);
  const productsByType = countProductsByType(products);

  return (
    <section className="statistics">
      <h1 className="statistics__title">{t('title')}</h1>

      <div className="statistics__grid">
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
