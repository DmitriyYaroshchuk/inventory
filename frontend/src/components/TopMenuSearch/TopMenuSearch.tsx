'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const SEARCH_PAGES = ['/products', '/orders', '/users'];

const DEBOUNCE_MS = 300;

const TopMenuSearch = () => {
  const t = useTranslations('topMenu');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const [value, setValue] = useState(urlQuery);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setValue(urlQuery);
  }

  useEffect(() => {
    const query = value.trim();
    if (query === urlQuery) return;

    const timer = setTimeout(() => {
      const isSearchPage = SEARCH_PAGES.includes(pathname);
      const params = new URLSearchParams(isSearchPage ? searchParams : undefined);

      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }

      const basePath = isSearchPage ? pathname : '/products';
      const queryString = params.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      if (isSearchPage) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [value, urlQuery, pathname, searchParams, router]);

  return (
    <input
      className="top-menu__search"
      type="search"
      placeholder={t('search')}
      aria-label={t('search')}
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
};
export default TopMenuSearch;
