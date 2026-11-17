'use client';

import { useState, useTransition } from 'react';
import type { SubmitEvent } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { EMAIL_PATTERN } from '@/utils/validation';
import { loginAction } from '@/actions/auth';
import AuthCard from '@/components/AuthCard/AuthCard';

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

type FormErrors = {
  email?: string;
  password?: string;
};

const validate = (email: string, password: string, t: ValidationTranslator): FormErrors => {
  const errors: FormErrors = {};

  if (!email.trim()) errors.email = t('emailRequired');
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = t('emailInvalid');

  if (!password) errors.password = t('passwordRequired');

  return errors;
};

const Login = () => {
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const t = useTranslations('auth');
  const tValidation = useTranslations('validation');

  const errors = validate(email, password, tValidation);
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (hasErrors) return;

    startTransition(async () => {
      const error = await loginAction(email.trim(), password);
      setIsError(Boolean(error));
    });
  };

  return (
    <AuthCard
      title={t('loginTitle')}
      footer={
        <>
          {t('noAccount')} <Link href="/register">{t('register')}</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">
            {t('email')}
          </label>
          <input
            id="login-email"
            type="email"
            className={`form-control${isSubmitted && errors.email ? ' is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            autoFocus
          />
          {isSubmitted && errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">
            {t('password')}
          </label>
          <input
            id="login-password"
            type="password"
            className={`form-control${isSubmitted && errors.password ? ' is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {isSubmitted && errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        {isError && <div className="alert alert-danger">{t('invalidCredentials')}</div>}

        <button type="submit" className="btn btn-success w-100" disabled={isPending}>
          {isPending ? t('loggingIn') : t('login')}
        </button>
      </form>
    </AuthCard>
  );
};
export default Login;
