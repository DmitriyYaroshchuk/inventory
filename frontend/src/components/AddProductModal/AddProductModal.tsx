'use client';

import { useState, useTransition } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { useTranslations } from 'next-intl';
import { createProductAction } from '@/actions/products';
import { useProductTypeLabel } from '@/hooks/useProductTypeLabel';
import FormModal from '@/components/FormModal/FormModal';

type AddProductModalProps = {
  orderId: number;
  types: string[];
  onClose: () => void;
};

type FormValues = {
  title: string;
  type: string;
  serialNumber: string;
  condition: 'new' | 'used';
  priceUsd: string;
  priceUah: string;
  guaranteeStart: string;
  guaranteeEnd: string;
  specification: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

const TITLE_MIN = 2;
const TITLE_MAX = 255;
const SPECIFICATION_MAX = 1000;

const today = () => new Date().toISOString().slice(0, 10);

const isPositiveInt = (value: string) => {
  const number = Number(value);
  return value.trim() !== '' && Number.isInteger(number) && number > 0;
};

const isPrice = (value: string) => value.trim() !== '' && Number(value) >= 0;

const validate = (values: FormValues, t: ValidationTranslator): FormErrors => {
  const errors: FormErrors = {};
  const title = values.title.trim();

  if (!title) errors.title = t('required');
  else if (title.length < TITLE_MIN) errors.title = t('minLength', { count: TITLE_MIN });
  else if (title.length > TITLE_MAX) errors.title = t('maxLength', { count: TITLE_MAX });

  if (!values.type) errors.type = t('required');
  if (!isPositiveInt(values.serialNumber)) errors.serialNumber = t('positiveInteger');
  if (!isPrice(values.priceUsd)) errors.priceUsd = t('price');
  if (!isPrice(values.priceUah)) errors.priceUah = t('price');

  if (!values.guaranteeStart) errors.guaranteeStart = t('required');
  if (!values.guaranteeEnd) errors.guaranteeEnd = t('required');
  else if (values.guaranteeEnd < values.guaranteeStart) errors.guaranteeEnd = t('dateOrder');

  if (values.specification.trim().length > SPECIFICATION_MAX) {
    errors.specification = t('maxLength', { count: SPECIFICATION_MAX });
  }

  return errors;
};

const AddProductModal = ({ orderId, types, onClose }: AddProductModalProps) => {
  const [values, setValues] = useState<FormValues>({
    title: '',
    type: types[0] ?? '',
    serialNumber: '',
    condition: 'new',
    priceUsd: '',
    priceUah: '',
    guaranteeStart: today(),
    guaranteeEnd: '',
    specification: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const t = useTranslations('addProduct');
  const tCommon = useTranslations('common');
  const tValidation = useTranslations('validation');
  const typeLabel = useProductTypeLabel();

  const errors = validate(values, tValidation);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const fieldClass = (name: keyof FormValues, base = 'form-control') =>
    `${base}${isSubmitted && errors[name] ? ' is-invalid' : ''}`;

  const fieldError = (name: keyof FormValues) =>
    isSubmitted && errors[name] && <div className="invalid-feedback">{errors[name]}</div>;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (hasErrors) return;

    startTransition(async () => {
      const isSuccess = await createProductAction({
        orderId,
        title: values.title.trim(),
        type: values.type,
        serialNumber: Number(values.serialNumber),
        isNew: values.condition === 'new',
        specification: values.specification.trim(),
        guaranteeStart: values.guaranteeStart,
        guaranteeEnd: values.guaranteeEnd,
        priceUsd: Number(values.priceUsd),
        priceUah: Number(values.priceUah),
      });

      if (isSuccess) {
        onClose();
      } else {
        setIsError(true);
      }
    });
  };

  return (
    <FormModal title={t('title')} onClose={onClose}>
      <form className="form-modal__form" onSubmit={handleSubmit} noValidate>
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="product-title" className="form-label">
              {t('name')}
            </label>
            <input
              id="product-title"
              name="title"
              className={fieldClass('title')}
              value={values.title}
              onChange={handleChange}
              autoFocus
            />
            {fieldError('title')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-type" className="form-label">
              {t('type')}
            </label>
            <select
              id="product-type"
              name="type"
              className={fieldClass('type', 'form-select')}
              value={values.type}
              onChange={handleChange}
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type)}
                </option>
              ))}
            </select>
            {fieldError('type')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-condition" className="form-label">
              {t('condition')}
            </label>
            <select
              id="product-condition"
              name="condition"
              className="form-select"
              value={values.condition}
              onChange={handleChange}
            >
              <option value="new">{tCommon('new')}</option>
              <option value="used">{tCommon('used')}</option>
            </select>
          </div>

          <div className="col-12">
            <label htmlFor="product-serial" className="form-label">
              {t('serialNumber')}
            </label>
            <input
              id="product-serial"
              name="serialNumber"
              type="number"
              min={1}
              className={fieldClass('serialNumber')}
              value={values.serialNumber}
              onChange={handleChange}
            />
            {fieldError('serialNumber')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-price-usd" className="form-label">
              {t('priceUsd')}
            </label>
            <input
              id="product-price-usd"
              name="priceUsd"
              type="number"
              min={0}
              step="0.01"
              className={fieldClass('priceUsd')}
              value={values.priceUsd}
              onChange={handleChange}
            />
            {fieldError('priceUsd')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-price-uah" className="form-label">
              {t('priceUah')}
            </label>
            <input
              id="product-price-uah"
              name="priceUah"
              type="number"
              min={0}
              step="0.01"
              className={fieldClass('priceUah')}
              value={values.priceUah}
              onChange={handleChange}
            />
            {fieldError('priceUah')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-guarantee-start" className="form-label">
              {t('guaranteeStart')}
            </label>
            <input
              id="product-guarantee-start"
              name="guaranteeStart"
              type="date"
              className={fieldClass('guaranteeStart')}
              value={values.guaranteeStart}
              onChange={handleChange}
            />
            {fieldError('guaranteeStart')}
          </div>

          <div className="col-sm-6">
            <label htmlFor="product-guarantee-end" className="form-label">
              {t('guaranteeEnd')}
            </label>
            <input
              id="product-guarantee-end"
              name="guaranteeEnd"
              type="date"
              className={fieldClass('guaranteeEnd')}
              value={values.guaranteeEnd}
              onChange={handleChange}
            />
            {fieldError('guaranteeEnd')}
          </div>

          <div className="col-12">
            <label htmlFor="product-specification" className="form-label">
              {t('specification')}
            </label>
            <textarea
              id="product-specification"
              name="specification"
              rows={3}
              className={fieldClass('specification')}
              value={values.specification}
              onChange={handleChange}
            />
            {fieldError('specification')}
          </div>
        </div>

        {isError && <div className="alert alert-danger mt-3">{t('error')}</div>}

        <div className="form-modal__actions">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            {tCommon('cancel')}
          </button>
          <button type="submit" className="btn btn-success" disabled={isPending}>
            {isPending ? t('saving') : t('submit')}
          </button>
        </div>
      </form>
    </FormModal>
  );
};

export default AddProductModal;
