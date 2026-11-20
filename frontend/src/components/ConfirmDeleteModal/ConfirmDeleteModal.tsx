import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { Product } from '@/types';
import './ConfirmDeleteModal.scss';

type ConfirmDeleteModalProps = {
  title: string;
  errorText: string;
  products: Product[];
  isDeleting: boolean;
  isError: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ConfirmDeleteModal = ({
  title,
  errorText,
  products,
  isDeleting,
  isError,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) => {
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
    <div className="confirm-delete-modal" onClick={onCancel}>
      <div
        className="confirm-delete-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="confirm-delete-modal__close"
          type="button"
          aria-label={tCommon('close')}
          onClick={onCancel}
        >
          ×
        </button>

        <h2 id="confirm-delete-modal-title" className="confirm-delete-modal__title">
          {title}
        </h2>

        <ul className="confirm-delete-modal__list">
          {products.map((product) => (
            <li key={product.id} className="confirm-delete-modal__product">
              <span
                className={`confirm-delete-modal__dot${product.isNew ? ' confirm-delete-modal__dot--new' : ''}`}
              />
              <Image
                className="confirm-delete-modal__photo"
                src={`/${product.photo ?? 'monitor.png'}`}
                alt=""
                width={48}
                height={36}
              />
              <div className="confirm-delete-modal__info">
                <span className="confirm-delete-modal__name">{product.title}</span>
                <span className="confirm-delete-modal__serial">SN-{product.serialNumber}</span>
              </div>
            </li>
          ))}
        </ul>

        {isError && <p className="confirm-delete-modal__error">{errorText}</p>}

        <div className="confirm-delete-modal__actions">
          <button className="confirm-delete-modal__cancel" type="button" onClick={onCancel}>
            {tCommon('cancel')}
          </button>
          <button
            className="confirm-delete-modal__confirm"
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

export default ConfirmDeleteModal;
