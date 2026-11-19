import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useProductTypeLabel } from '@/hooks/useProductTypeLabel';
import DeleteProductButton from '@/components/DeleteProductButton/DeleteProductButton';
import type { Product } from '@/types';
import { formatLongDate, formatMoney, formatShortDate, getPrice } from '@/utils/format';
import './ProductItem.scss';

type ProductItemProps = {
  product: Product;
  isAuthenticated: boolean;
};

const ProductItem = ({ product, isAuthenticated }: ProductItemProps) => {
  const { title, serialNumber, isNew, photo, type, guarantee, price, order, date } = product;
  const locale = useLocale();
  const t = useTranslations('products');
  const typeLabel = useProductTypeLabel();

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

      <span className="product-item__type">{typeLabel(type)}</span>

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

      <DeleteProductButton
        product={product}
        isAuthenticated={isAuthenticated}
        className="product-item__delete"
      />
    </li>
  );
};

export default ProductItem;
