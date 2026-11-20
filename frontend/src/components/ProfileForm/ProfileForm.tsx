'use client';

import { useState, useTransition } from 'react';
import type { SubmitEvent } from 'react';
import { useTranslations } from 'next-intl';
import { updateNameAction } from '@/actions/settings';

type ProfileFormProps = {
  initialName: string;
  email: string;
};

type Status = 'idle' | 'saved' | 'error';

const NAME_MIN = 2;
const NAME_MAX = 100;

const ProfileForm = ({ initialName, email }: ProfileFormProps) => {
  const [name, setName] = useState(initialName);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [isPending, startTransition] = useTransition();

  const t = useTranslations('settings');
  const tValidation = useTranslations('validation');

  const cleanName = name.trim();
  const error =
    cleanName.length < NAME_MIN
      ? tValidation('minLength', { count: NAME_MIN })
      : cleanName.length > NAME_MAX
        ? tValidation('maxLength', { count: NAME_MAX })
        : null;

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (error) return;

    startTransition(async () => {
      const isSuccess = await updateNameAction(cleanName);
      setStatus(isSuccess ? 'saved' : 'error');
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="settings-name" className="form-label">
          {t('name')}
        </label>
        <input
          id="settings-name"
          className={`form-control${isSubmitted && error ? ' is-invalid' : ''}`}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setStatus('idle');
          }}
          autoComplete="name"
        />
        {isSubmitted && error && <div className="invalid-feedback">{error}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="settings-email" className="form-label">
          {t('email')}
        </label>
        <input id="settings-email" className="form-control" value={email} disabled />
      </div>

      {status === 'saved' && <div className="alert alert-success">{t('saved')}</div>}
      {status === 'error' && <div className="alert alert-danger">{t('saveError')}</div>}

      <button type="submit" className="btn btn-success" disabled={isPending}>
        {isPending ? t('saving') : t('save')}
      </button>
    </form>
  );
};

export default ProfileForm;
