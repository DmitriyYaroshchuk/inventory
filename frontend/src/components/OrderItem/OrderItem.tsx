import { OrderSummary } from "@/types"
import { formatLongDate, formatMoney, formatShortDate, getPrice, pluralize } from "@/utils/format"

type OrderItemProps = {
    order: OrderSummary
}

const OrderItem = ({ order }: OrderItemProps) => {
    const usd = getPrice(order.total, 'USD');
    const uah = getPrice(order.total, 'UAH');

    return (
        <li className="order-item">
            <span className="order-item__title">{order.title}</span>

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

            <div className="order-item__total">
                <span className="order-item__total-usd">{formatMoney(usd)} $</span>
                <span className="order-item__total-uah">{formatMoney(uah)} UAH</span>
            </div>

            <button className="order-item__delete" type="button" aria-label="Удалить приход">
                🗑
            </button>
        </li>
    )
}
export default OrderItem;