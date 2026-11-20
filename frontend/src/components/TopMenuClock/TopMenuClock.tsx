'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { getMonthName, pad } from '@/utils/format';

const TopMenuClock = () => {
  const [now, setNow] = useState<Date | null>(null);
  const locale = useLocale();

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return null;

  return (
    <div className="top-menu__clock">
      <div className="top-menu__weekday">{now.toLocaleDateString(locale, { weekday: 'long' })}</div>
      <div className="top-menu__datetime">
        <span className="top-menu__date">
          {pad(now.getDate())} {getMonthName(now.getMonth(), locale)}, {now.getFullYear()}
        </span>
        <span className="top-menu__time">
          <svg
            className="top-menu__icon"
            viewBox="0 0 20 20"
            width="20"
            height="20"
            aria-hidden="true"
          >
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
          {now.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
          })}
        </span>
      </div>
    </div>
  );
};
export default TopMenuClock;
