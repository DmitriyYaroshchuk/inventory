import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { Product } from '@/types';
import {
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
    const locale = useLocale();
    const t = useTranslations('products');
    const tCommon = useTranslations('common');

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
                <div className="product-item__guarantee-item">
                    <span className="product-item__muted">{t('from')}</span>
                    <div className="product-item__date">
                        <span className="product-item__muted">{formatShortDate(guarantee.start)}</span>
                        <span>{formatLongDate(guarantee.start, locale)}</span>
                    </div>
                </div>

                <div className="product-item__guarantee-item">
                    <span className="product-item__muted">{t('to')}</span>
                    <div className="product-item__date">
                        <span className="product-item__muted">{formatShortDate(guarantee.end)}</span>
                        <span>{formatLongDate(guarantee.end, locale)}</span>
                    </div>
                </div>
            </div>

            <span className="product-item__state">{isNew ? t('new') : t('used')}</span>

            <div className="product-item__price">
                <span className="product-item__muted">{formatMoney(getPrice(price, 'USD'), locale)} $</span>
                <span>
                    {formatMoney(getPrice(price, 'UAH'), locale)}{' '}
                    <small className="product-item__currency">UAH</small>
                </span>
            </div>

            <span className="product-item__order">{order.title}</span>
            <span className="product-item__empty">—</span>

            <span className="product-item__order">{order.title}</span>

            <div className="product-item__date">
                <span className="product-item__muted">{formatShortDate(date)}</span>
                <span>{formatLongDate(date, locale)}</span>
            </div>

            <button
                type="button"
                className="product-item__delete"
                aria-label={tCommon('deleteProduct')}
                title={tCommon('comingSoon')}
                disabled
            >
                <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor" aria-hidden="true">
                    <path d="M4 0h4l.5 1H12v2H0V1h3.5L4 0ZM1 4h10l-.8 10H1.8L1 4Z" />
                </svg>
            </button>
        </li>
    );
};

export default ProductItem;