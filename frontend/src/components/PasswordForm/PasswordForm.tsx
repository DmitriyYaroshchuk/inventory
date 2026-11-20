'use client';

import { useState, useTransition } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';
import { useTranslations } from 'next-intl';
import { changePasswordAction } from '@/actions/settings';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type Status = 'idle' | 'saved' | 'wrongPassword' | 'error';

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

const PASSWORD_MIN = 6;

const INITIAL_VALUES: FormValues = { currentPassword: '', newPassword: '', confirmPassword: '' };

const validate = (values: FormValues, t: ValidationTranslator): FormErrors => {
  const errors: FormErrors = {};

  if (!values.currentPassword) errors.currentPassword = t('passwordRequired');
  if (values.newPassword.length < PASSWORD_MIN) {
    errors.newPassword = t('minLength', { count: PASSWORD_MIN });
  }
  if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = t('passwordsMismatch');
  }

  return errors;
};

const PasswordForm = () => {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [isPending, startTransition] = useTransition();

  const t = useTranslations('settings');
  const tValidation = useTranslations('validation');

  const errors = validate(values, tValidation);
  const hasErrors = Object.keys(errors).length > 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setStatus('idle');
  };

  const fieldClass = (name: keyof FormValues) =>
    `form-control${isSubmitted && errors[name] ? ' is-invalid' : ''}`;

  const fieldError = (name: keyof FormValues) =>
    isSubmitted && errors[name] && <div className="invalid-feedback">{errors[name]}</div>;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (hasErrors) return;

    startTransition(async () => {
      const error = await changePasswordAction(values.currentPassword, values.newPassword);

      if (error) {
        setStatus(error === 'wrongPassword' ? 'wrongPassword' : 'error');
        return;
      }

      // пароль сменился — очищаем поля, чтобы он не остался на экране
      setValues(INITIAL_VALUES);
      setIsSubmitted(false);
      setStatus('saved');
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="settings-current-password" className="form-label">
          {t('currentPassword')}
        </label>
        <input
          id="settings-current-password"
          name="currentPassword"
          type="password"
          className={fieldClass('currentPassword')}
          value={values.currentPassword}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {fieldError('currentPassword')}
      </div>

      <div className="mb-3">
        <label htmlFor="settings-new-password" className="form-label">
          {t('newPassword')}
        </label>
        <input
          id="settings-new-password"
          name="newPassword"
          type="password"
          className={fieldClass('newPassword')}
          value={values.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {fieldError('newPassword')}
      </div>

      <div className="mb-3">
        <label htmlFor="settings-confirm-password" className="form-label">
          {t('confirmPassword')}
        </label>
        <input
          id="settings-confirm-password"
          name="confirmPassword"
          type="password"
          className={fieldClass('confirmPassword')}
          value={values.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />
        {fieldError('confirmPassword')}
      </div>

      {status === 'saved' && <div className="alert alert-success">{t('passwordChanged')}</div>}
      {status === 'wrongPassword' && <div className="alert alert-danger">{t('wrongPassword')}</div>}
      {status === 'error' && <div className="alert alert-danger">{t('passwordError')}</div>}

      <button type="submit" className="btn btn-success" disabled={isPending}>
        {isPending ? t('saving') : t('changePassword')}
      </button>
    </form>
  );
};

export default PasswordForm;
