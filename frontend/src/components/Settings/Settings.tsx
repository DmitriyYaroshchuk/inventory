import { getTranslations } from 'next-intl/server';
import type { User } from '@/types';
import ProfileForm from '@/components/ProfileForm/ProfileForm';
import PasswordForm from '@/components/PasswordForm/PasswordForm';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher';
import { getTheme } from '@/lib/get-theme';
import './Settings.scss';

type SettingsProps = {
  user: User;
};

const Settings = async ({ user }: SettingsProps) => {
  const t = await getTranslations('settings');
  const theme = await getTheme();

  return (
    <section className="settings">
      <h1 className="settings__title">{t('title')}</h1>

      <div className="settings__grid">
        <div className="settings__card">
          <h2 className="settings__subtitle">{t('profile')}</h2>
          <ProfileForm initialName={user.name} email={user.email} />
        </div>

        <div className="settings__card">
          <h2 className="settings__subtitle">{t('password')}</h2>
          <PasswordForm />
        </div>

        <div className="settings__card">
          <h2 className="settings__subtitle">{t('language')}</h2>
          <LocaleSwitcher />
        </div>

        <div className="settings__card">
          <h2 className="settings__subtitle">{t('theme')}</h2>
          <ThemeSwitcher value={theme} showLabels />
        </div>
      </div>
    </section>
  );
};

export default Settings;
