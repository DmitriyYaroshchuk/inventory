import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { OrderDetails as OrderDetailsType } from '@/types';
import DeleteProductButton from '@/components/DeleteProductButton/DeleteProductButton';
import AddProductButton from '@/components/AddProductButton/AddProductButton';
import './OrderDetails.scss';

type OrderDetailsProps = {
  order: OrderDetailsType;
  isAuthenticated: boolean;
  types: string[];
};

const OrderDetails = ({ order, types, isAuthenticated }: OrderDetailsProps) => {
  const tCommon = useTranslations('common');

  return (
    <section className="order-details">
      <Link
        className="order-details__close"
        href="/orders"
        scroll={false}
        aria-label={tCommon('close')}
      >
        ×
      </Link>

      <h2 className="order-details__title">{order.title}</h2>

      <AddProductButton orderId={order.id} types={types} isAuthenticated={isAuthenticated} />

      <ul className="order-details__list">
        {order.products.map((product) => (
          <li key={product.id} className="order-details__product">
            <span
              className={`order-details__dot${product.isNew ? ' order-details__dot--new' : ''}`}
            />

            <Image
              className="order-details__photo"
              src={`/${product.photo ?? 'monitor.png'}`}
              alt=""
              width={48}
              height={36}
            />

            <div className="order-details__info">
              <span className="order-details__name">{product.title}</span>
              <span className="order-details__serial">SN-{product.serialNumber}</span>
            </div>

            <span
              className={`order-details__state${product.isNew ? ' order-details__state--new' : ''}`}
            >
              {product.isNew ? tCommon('new') : tCommon('used')}
            </span>

            <DeleteProductButton
              product={product}
              isAuthenticated={isAuthenticated}
              className="order-details__delete"
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OrderDetails;
