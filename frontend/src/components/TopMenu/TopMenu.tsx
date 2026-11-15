import Link from 'next/link';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import TopMenuClock from '@/components/TopMenuClock/TopMenuClock';
import TopMenuSearch from '@/components/TopMenuSearch/TopMenuSearch';
import TopMenuSessions from '@/components/TopMenuSessions/TopMenuSessions';
import './TopMenu.scss';

const TopMenu = () => (
  <header className="top-menu">
    <Link className="top-menu__brand" href="/">
      <svg className="top-menu__logo" viewBox="0 0 24 28" aria-hidden="true">
        <path d="M12 1 2 5v8c0 6 4.3 11.2 10 14 5.7-2.8 10-8 10-14V5L12 1z" fill="currentColor" />
        <circle cx="12" cy="11" r="3.2" fill="#fff" />
        <path
          d="M6.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5c-1.5 1.5-3.5 2.5-5.5 2.5S8 21.5 6.5 20z"
          fill="#fff"
        />
      </svg>
      INVENTORY
    </Link>

    <TopMenuSearch />

    <div className="top-menu__info">
      <LocaleSwitcher />
      <TopMenuSessions />
      <TopMenuClock />
    </div>
  </header>
);

export default TopMenu;
