'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './NavigationMenu.scss';

type NavigationItem = { href?: string; label: string };

const items: NavigationItem[] = [
    { href: '/orders', label: 'Приход' },
    { label: 'Группы' },
    { href: '/products', label: 'Продукты' },
    { label: 'Пользователи' },
    { label: 'Настройки' },
];

const NavigationMenu = () => {
    const pathname = usePathname();

    return (
        <nav className="navigation-menu">
            <ul className="navigation-menu__list">
                {items.map(({ href, label }) => (
                    <li key={label}>
                        {href ? (
                            <Link
                                href={href}
                                className={`navigation-menu__link${pathname.startsWith(href) ? ' navigation-menu__link--active' : ''}`}
                            >
                                {label}
                            </Link>
                        ) : (
                            <span className="navigation-menu__link navigation-menu__link--disabled">{label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavigationMenu;