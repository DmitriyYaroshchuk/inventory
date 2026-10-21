import Image from 'next/image';
import { useGetOrderQuery } from '@/services/api';
import { useAppDispatch } from '@/store/hooks';
import { selectOrder } from '@/store/ordersSlice';
import Loader from '@/components/Loader/Loader';
import './OrderDetails.scss';

type OrderDetailsProps = {
  orderId: number;
};

const OrderDetails = ({ orderId }: OrderDetailsProps) => {
  const dispatch = useAppDispatch();
  const { data: order, isLoading, isError } = useGetOrderQuery(orderId);

  return (
    <section className="order-details">
      <button
        className="order-details__close"
        type="button"
        aria-label="Закрыть"
        onClick={() => dispatch(selectOrder(null))}
      >
        ×
      </button>

      {isLoading && <Loader />}
      {isError && (
        <div className="alert alert-danger m-3" role="alert">
          Не удалось загрузить приход
        </div>
      )}

      {order && (
        <>
          <h2 className="order-details__title">{order.title}</h2>

          <button className="order-details__add" type="button">
            <span className="order-details__add-icon">+</span>
            Добавить продукт
          </button>

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
                  {product.isNew ? 'Новый' : 'Б/У'}
                </span>

                <button className="order-details__delete" type="button" aria-label="Удалить продукт">
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                    <path d="M6 2h4l1 1h3v2H2V3h3l1-1zM3 6h10l-1 8H4L3 6z" fill="currentColor" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};

export default OrderDetails;