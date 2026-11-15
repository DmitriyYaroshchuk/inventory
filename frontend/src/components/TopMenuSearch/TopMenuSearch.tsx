'use client';

import { useTranslations } from 'next-intl';

const TopMenuSearch = () => {
  const t = useTranslations('topMenu');

  return (
    <input
      className="top-menu__search"
      type="search"
      placeholder={t('search')}
      aria-label={t('search')}
    />
  );
};

export default TopMenuSearch;
