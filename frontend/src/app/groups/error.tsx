'use client';

import { useTranslations } from 'next-intl';

const GroupsError = () => {
  const t = useTranslations('groups');

  return (
    <div className="alert alert-danger" role="alert">
      {t('loadError')}
    </div>
  );
};

export default GroupsError;
