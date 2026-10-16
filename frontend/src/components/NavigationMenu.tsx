'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navigation.scss";

const links = [
    { href: '/orders', label: 'Приход' },
    { href: '/products', label: 'Продукты' },
];

const Navigation = () => {
    const pathname = usePathname();

    return (
        <nav className="navigation">
            <ul className="navigation__list">
                {
                    links.map(({ href, label }) => (
                        <li key={href}>
                            <Link
                                href={href}
                                className={`navigation__link${pathname.startsWith(href) ? ' navigation__link--active' : ''}`}>
                                {label}
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
    )
}
export default Navigation;