import Image from 'next/image';
import type { Product } from '@/types';
import {
    formatFullDate,
    formatLongDate,
    formatMoney,
    formatShortDate,
    getPrice,
} from '@/utils/format';
import './ProductItem.scss';

type ProductItemProps = {
    product: Product;
};

const ProductItem = ({ product }: ProductItemProps) => {
    const { title, serialNumber, isNew, photo, type, guarantee, price, order, date } = product;

    return (
        <li className="product-item">
            <span className={`product-item__dot${isNew ? ' product-item__dot--new' : ''}`} />

            <Image
                className="product-item__photo"
                src={`/${photo ?? 'monitor.png'}`}
                alt={title}
                width={40}
                height={40}
            />

            <div className="product-item__info">
                <span className="product-item__title">{title}</span>
                <span className="product-item__muted">SN-{serialNumber}</span>
            </div>

            <span className="product-item__type">{type}</span>

            <div className="product-item__guarantee">
                <span className="product-item__muted">с</span>
                <span>{formatFullDate(guarantee.start)}</span>
                <span className="product-item__muted">по</span>
                <span>{formatFullDate(guarantee.end)}</span>
            </div>

            <span className="product-item__state">{isNew ? 'новый' : 'Б / У'}</span>

            <div className="product-item__price">
                <span className="product-item__muted">{formatMoney(getPrice(price, 'USD'))} $</span>
                <span>
                    {formatMoney(getPrice(price, 'UAH'))}{' '}
                    <small className="product-item__currency">UAH</small>
                </span>
            </div>

            <span className="product-item__order">{order.title}</span>
            <span className="product-item__empty">—</span>

            <span className="product-item__order">{order.title}</span>

            <div className="product-item__date">
                <span className="product-item__muted">{formatShortDate(date)}</span>
                <span>{formatLongDate(date)}</span>
            </div>

            <button type="button" className="product-item__delete" aria-label="Удалить продукт">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                    <path d="M4 0h4l.5 1H12v2H0V1h3.5L4 0ZM1 4h10l-.8 10H1.8L1 4Z" />
                </svg>
            </button>
        </li>
    );
};

export default ProductItem;