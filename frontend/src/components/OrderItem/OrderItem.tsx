import type { OrderSummary } from '@/types';
import { formatLongDate, formatMoney, formatShortDate, getPrice, pluralize } from "@/utils/format"
import './OrderItem.scss'

type OrderItemProps = {
    order: OrderSummary,
    isCompact: boolean,
    isActive: boolean,
    onOpen: () => void,
    onDelete: () => void
}

const OrderItem = ({ order, isCompact, isActive, onOpen, onDelete }: OrderItemProps) => {
    const usd = getPrice(order.total, 'USD');
    const uah = getPrice(order.total, 'UAH');

    const className = [
        'order-item',
        isCompact && 'order-item--compact',
        isActive && 'order-item--active',
    ].filter(Boolean).join(' ');

    return (
        <li className={className}>
            {!isCompact && (
                <button className="order-item__title" type="button" onClick={onOpen}>
                    {order.title}
                </button>
            )}

            <button className="order-item__open"
                type="button"
                aria-label="Показать продукты прихода"
                onClick={onOpen}>
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                    <circle cx="3" cy="5" r="1.6" fill="currentColor" />
                    <rect x="6.5" y="4" width="11" height="2" rx="1" fill="currentColor" />
                    <circle cx="3" cy="10" r="1.6" fill="currentColor" />
                    <rect x="6.5" y="9" width="11" height="2" rx="1" fill="currentColor" />
                    <circle cx="3" cy="15" r="1.6" fill="currentColor" />
                    <rect x="6.5" y="14" width="11" height="2" rx="1" fill="currentColor" />
                </svg>
            </button>

            <div className="order-item__count">
                <span className="order-item__count-value">{order.productsCount}</span>
                <span className="order-item__count-label">
                    {
                        pluralize(order.productsCount, ['Продукт', 'Продукта', 'Продуктов'])
                    }
                </span>
            </div>

            <div className="order-item__date">
                <span className="order-item__date-short">{formatShortDate(order.date)}</span>
                <span className="order-item__date-long">{formatLongDate(order.date)}</span>
            </div>

            {!isCompact && (
                <>
                    <div className="order-item__total">
                        <span className="order-item__total-usd">{formatMoney(usd)} $</span>
                        <span className="order-item__total-uah">
                            {formatMoney(uah)} <span className="order-item__currency">UAH</span>
                        </span>
                    </div>

                    <button className="order-item__delete" type="button" aria-label="Удалить приход" onClick={onDelete}>
                        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                            <path d="M6 2h4l1 1h3v2H2V3h3l1-1zM3 6h10l-1 8H4L3 6z" fill="currentColor" />
                        </svg>
                    </button>
                </>
            )}

            {isActive && (
                <span className="order-item__arrow" aria-hidden="true">
                    ›
                </span>
            )}
        </li>
    )
}
export default OrderItem;