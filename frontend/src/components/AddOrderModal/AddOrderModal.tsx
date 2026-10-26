'use client';

import { useEffect, useState } from 'react';
import type { SubmitEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useCreateOrderMutation } from '@/services/api';
import './AddOrderModal.scss';

type AddOrderModalProps = {
  onClose: () => void;
};

type FormErrors = {
  title?: string;
  description?: string;
};

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

const TITLE_MIN = 3;
const TITLE_MAX = 255;
const DESCRIPTION_MAX = 1000;

const validate = (title: string, description: string, t: ValidationTranslator): FormErrors => {
  const errors: FormErrors = {};
  const cleanTitle = title.trim();

  if (!cleanTitle) errors.title = t('titleRequired');
  else if (cleanTitle.length < TITLE_MIN) errors.title = t('minLength', { count: TITLE_MIN });
  else if (cleanTitle.length > TITLE_MAX) errors.title = t('maxLength', { count: TITLE_MAX });

  if (description.trim().length > DESCRIPTION_MAX) {
    errors.description = t('maxLength', { count: DESCRIPTION_MAX });
  }

  return errors;
};

const AddOrderModal = ({ onClose }: AddOrderModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createOrder, { isLoading, isError }] = useCreateOrderMutation();
  const t = useTranslations('addOrder');
  const tCommon = useTranslations('common');
  const tValidation = useTranslations('validation');

  const errors = validate(title, description, tValidation);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (hasErrors) return;

    try {
      await createOrder({ title: title.trim(), description: description.trim() }).unwrap();
      onClose();
    } catch (error) {
      console.error('Не удалось создать приход:', error);
    }
  };

  return createPortal(
    <div className="add-order-modal" onClick={onClose}>
      <div
        className="add-order-modal__window"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-order-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-order-title" className="add-order-modal__title">
          {t('title')}
        </h2>

        <form className="add-order-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="order-title" className="form-label">
              {t('name')}
            </label>
            <input
              id="order-title"
              className={`form-control${isSubmitted && errors.title ? ' is-invalid' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            {isSubmitted && errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="order-description" className="form-label">
              {t('description')}
            </label>
            <textarea
              id="order-description"
              className={`form-control${isSubmitted && errors.description ? ' is-invalid' : ''}`}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="form-text">
              {description.trim().length} / {DESCRIPTION_MAX}
            </div>
            {isSubmitted && errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>

          {isError && <div className="alert alert-danger">{t('error')}</div>}

          <div className="add-order-modal__actions">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              {tCommon('cancel')}
            </button>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? t('saving') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
};
export default AddOrderModal;
