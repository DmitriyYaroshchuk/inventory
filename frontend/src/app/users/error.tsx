'use client';

import { useTranslations } from 'next-intl';

const UsersError = () => {
  const t = useTranslations('users');

  return (
    <div className="alert alert-danger" role="alert">
      {t('loadError')}
    </div>
  );
};

export default UsersError;
