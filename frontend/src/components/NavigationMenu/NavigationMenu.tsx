'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { NavigationItem } from '@/types';
import './NavigationMenu.scss';

const items: NavigationItem[] = [
  { href: '/orders', labelKey: 'orders' },
  { labelKey: 'groups' },
  { href: '/products', labelKey: 'products' },
  { href: '/statistics', labelKey: 'statistics' },
  { href: '/warehouses', labelKey: 'warehouses' },
  { labelKey: 'users' },
  { labelKey: 'settings' },
];

const NavigationMenu = () => {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav className="navigation-menu">
      <ul className="navigation-menu__list">
        {items.map(({ href, labelKey }) => (
          <li key={labelKey}>
            {href ? (
              <Link
                href={href}
                className={`navigation-menu__link${pathname.startsWith(href) ? ' navigation-menu__link--active' : ''}`}
              >
                {t(labelKey)}
              </Link>
            ) : (
              <span className="navigation-menu__link navigation-menu__link--disabled">
                {t(labelKey)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
