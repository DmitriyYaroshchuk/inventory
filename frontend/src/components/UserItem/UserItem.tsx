import { useLocale, useTranslations } from 'next-intl';
import type { UserListItem } from '@/types';
import { formatLongDate, formatShortDate } from '@/utils/format';
import './UserItem.scss';

type UserItemProps = {
  user: UserListItem;
  isCurrent: boolean;
};

const UserItem = ({ user, isCurrent }: UserItemProps) => {
  const { name, email, createdAt } = user;
  const locale = useLocale();
  const t = useTranslations('users');

  return (
    <li className={`user-item${isCurrent ? ' user-item--current' : ''}`}>
      <span className="user-item__avatar" aria-hidden="true">
        {name.charAt(0).toUpperCase()}
      </span>

      <div className="user-item__info">
        <span className="user-item__name">
          {name}
          {isCurrent && <span className="user-item__badge">{t('you')}</span>}
        </span>
        <span className="user-item__email">{email}</span>
      </div>

      <div className="user-item__date">
        <span className="user-item__muted">{t('registered')}</span>
        <span>{formatLongDate(createdAt, locale)}</span>
        <span className="user-item__muted">{formatShortDate(createdAt)}</span>
      </div>
    </li>
  );
};

export default UserItem;
