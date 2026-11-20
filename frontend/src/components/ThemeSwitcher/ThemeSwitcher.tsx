'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { THEME_COOKIE, THEMES, type Theme } from '@/lib/theme';
import './ThemeSwitcher.scss';

type ThemeSwitcherProps = {
  value: Theme;
  showLabels?: boolean;
};

const ICONS: Record<Theme, string> = {
  light:
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 0v2M8 14v2M0 8h2M14 8h2M2.3 2.3l1.4 1.4M12.3 12.3l1.4 1.4M2.3 13.7l1.4-1.4M12.3 3.7l1.4-1.4',
  dark: 'M6 .3A7 7 0 1 0 15.7 10 6 6 0 0 1 6 .3z',
  auto: 'M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5v11a5.5 5.5 0 0 1 0-11z',
};

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000`;
};

const ThemeSwitcher = ({ value, showLabels = false }: ThemeSwitcherProps) => {
  const t = useTranslations('theme');
  const router = useRouter();

  const handleChange = (next: Theme) => {
    applyTheme(next);
    router.refresh();
  };

  return (
    <div className="theme-switcher" role="group" aria-label={t('label')}>
      {THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          className={`theme-switcher__button${theme === value ? ' theme-switcher__button--active' : ''}`}
          aria-pressed={theme === value}
          aria-label={t(theme)}
          title={t(theme)}
          onClick={() => handleChange(theme)}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d={ICONS[theme]}
              fill={theme === 'light' ? 'none' : 'currentColor'}
              stroke={theme === 'light' ? 'currentColor' : 'none'}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {showLabels && <span>{t(theme)}</span>}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
