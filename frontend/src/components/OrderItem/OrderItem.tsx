import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { OrderSummary } from '@/types';
import { formatLongDate, formatMoney, formatShortDate, getPrice } from '@/utils/format';
import DeleteOrderButton from '@/components/DeleteOrderButton/DeleteOrderButton';
import './OrderItem.scss';

type OrderItemProps = {
  order: OrderSummary;
  isCompact: boolean;
  isActive: boolean;
  isAuthenticated: boolean;
};

const OrderItem = ({ order, isCompact, isActive, isAuthenticated }: OrderItemProps) => {
  const locale = useLocale();
  const t = useTranslations('orders');

  const usd = getPrice(order.total, 'USD');
  const uah = getPrice(order.total, 'UAH');

  const href = isActive ? '/orders' : `/orders?id=${order.id}`;

  const className = [
    'order-item',
    isCompact && 'order-item--compact',
    isActive && 'order-item--active',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={className}>
      {!isCompact && (
        <Link className="order-item__title" href={href} scroll={false}>
          {order.title}
        </Link>
      )}

      <Link className="order-item__open" href={href} scroll={false} aria-label={t('showProducts')}>
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <circle cx="3" cy="5" r="1.6" fill="currentColor" />
          <rect x="6.5" y="4" width="11" height="2" rx="1" fill="currentColor" />
          <circle cx="3" cy="10" r="1.6" fill="currentColor" />
          <rect x="6.5" y="9" width="11" height="2" rx="1" fill="currentColor" />
          <circle cx="3" cy="15" r="1.6" fill="currentColor" />
          <rect x="6.5" y="14" width="11" height="2" rx="1" fill="currentColor" />
        </svg>
      </Link>

      <div className="order-item__count">
        <span className="order-item__count-value">{order.productsCount}</span>
        <span className="order-item__count-label">
          {t('productsLabel', { count: order.productsCount })}
        </span>
      </div>

      <div className="order-item__date">
        <span className="order-item__date-short">{formatShortDate(order.date)}</span>
        <span className="order-item__date-long">{formatLongDate(order.date, locale)}</span>
      </div>

      {!isCompact && (
        <>
          <div className="order-item__total">
            <span className="order-item__total-usd">{formatMoney(usd, locale)} $</span>
            <span className="order-item__total-uah">
              {formatMoney(uah, locale)} <span className="order-item__currency">UAH</span>
            </span>
          </div>

          <DeleteOrderButton order={order} isAuthenticated={isAuthenticated} />
        </>
      )}

      {isActive && (
        <span className="order-item__arrow" aria-hidden="true">
          ›
        </span>
      )}
    </li>
  );
};
export default OrderItem;
