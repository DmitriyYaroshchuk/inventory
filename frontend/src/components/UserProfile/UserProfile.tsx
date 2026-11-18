import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';
import './UserProfile.scss';

const UserProfile = async () => {
  const t = await getTranslations('profile');
  const user = await getCurrentUser();

  return (
    <div className="user-profile">
      <div className="user-profile__photo">
        <Image
          className="user-profile__avatar"
          src="/avatar.jpg"
          alt={t('avatar')}
          width={96}
          height={96}
          loading="eager"
        />
        <button className="user-profile__settings" type="button" aria-label={t('settings')}>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z"
            />
          </svg>
        </button>
      </div>

      <div className="user-profile__account">
        {user ? (
          <>
            <span className="user-profile__name">{user.name}</span>
            <form action={logoutAction}>
              <button className="user-profile__action" type="submit">
                {t('logout')}
              </button>
            </form>
          </>
        ) : (
          <Link className="user-profile__action" href="/login">
            {t('login')}
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
