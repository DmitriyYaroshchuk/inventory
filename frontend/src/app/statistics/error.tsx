'use client';

import { useTranslations } from 'next-intl';

const StatisticsError = () => {
  const t = useTranslations('statistics');

  return (
    <div className="alert alert-danger" role="alert">
      {t('loadError')}
    </div>
  );
};

export default StatisticsError;
