'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './TopMenu.scss';

const MONTHS = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

const pad = (value: number) => String(value).padStart(2, '0');

const TopMenu = () => {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const tick = () => setNow(new Date());

        tick();
        const timer = setInterval(tick, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <header className="top-menu">
            <Link className="top-menu__brand" href="/">
                <svg className="top-menu__logo" viewBox="0 0 24 28" aria-hidden="true">
                    <path d="M12 1 2 5v8c0 6 4.3 11.2 10 14 5.7-2.8 10-8 10-14V5L12 1z" fill="currentColor" />
                    <circle cx="12" cy="11" r="3.2" fill="#fff" />
                    <path d="M6.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5c-1.5 1.5-3.5 2.5-5.5 2.5S8 21.5 6.5 20z" fill="#fff" />
                </svg>
                INVENTORY
            </Link>

            <input className="top-menu__search" type="search" placeholder="Поиск" aria-label="Поиск" />

            <div className="top-menu__info">
                {now && (
                    <div className="top-menu__clock">
                        <div className="top-menu__weekday">
                            {now.toLocaleDateString('ru-RU', { weekday: 'long' })}
                        </div>
                        <div className="top-menu__datetime">
                            <span className="top-menu__date">
                                {pad(now.getDate())} {MONTHS[now.getMonth()]}, {now.getFullYear()}
                            </span>
                            <span className="top-menu__time">
                                <svg className="top-menu__icon" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
                                    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path
                                        d="M10 5.5V10l3 2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                {now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default TopMenu;