import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetOrderQuery } from '@/services/api';
import type { OrderSummary } from '@/types';
import './DeleteOrderModal.scss';

type DeleteOrderModalProps = {
  order: OrderSummary;
  isDeleting: boolean;
  isError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const DeleteOrderModal = ({
  order,
  isDeleting,
  isError,
  onCancel,
  onConfirm,
}: DeleteOrderModalProps) => {
  const { data: details } = useGetOrderQuery(order.id);
  const t = useTranslations('deleteOrder');
  const tCommon = useTranslations('common');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return createPortal(
    <div className="delete-order-modal" onClick={onCancel}>
      <div
        className="delete-order-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-order-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="delete-order-modal__close"
          type="button"
          aria-label={tCommon('close')}
          onClick={onCancel}
        >
          ×
        </button>

        <h2 id="delete-order-modal-title" className="delete-order-modal__title">
          {t('title')}
        </h2>

        <ul className="delete-order-modal__list">
          {details?.products.map((product) => (
            <li key={product.id} className="delete-order-modal__product">
              <span
                className={`delete-order-modal__dot${product.isNew ? ' delete-order-modal__dot--new' : ''}`}
              />
              <Image
                className="delete-order-modal__photo"
                src={`/${product.photo ?? 'monitor.png'}`}
                alt=""
                width={48}
                height={36}
              />
              <div className="delete-order-modal__info">
                <span className="delete-order-modal__name">{product.title}</span>
                <span className="delete-order-modal__serial">SN-{product.serialNumber}</span>
              </div>
            </li>
          ))}
        </ul>

        {isError && <p className="delete-order-modal__error">{t('error')}</p>}

        <div className="delete-order-modal__actions">
          <button className="delete-order-modal__cancel" type="button" onClick={onCancel}>
            {tCommon('cancel')}
          </button>
          <button
            className="delete-order-modal__confirm"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M6 2h4l1 1h3v2H2V3h3l1-1zM3 6h10l-1 8H4L3 6z" fill="currentColor" />
            </svg>
            {isDeleting ? tCommon('deleting') : tCommon('delete')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default DeleteOrderModal;
