import { getTranslations } from 'next-intl/server';
import { getAuthToken } from '@/lib/auth';
import { fetchUsers } from '@/services/server-api';
import UserItem from '@/components/UserItem/UserItem';
import './Users.scss';

type UsersProps = {
  currentUserId: number;
  search: string;
};

const Users = async ({ currentUserId, search }: UsersProps) => {
  const t = await getTranslations('users');
  const token = await getAuthToken();
  const users = await fetchUsers(token, search || undefined);

  return (
    <section className="users">
      <h1 className="users__title">{t('title', { count: users.length })}</h1>

      {users.length === 0 && <p className="text-muted">{t('empty')}</p>}

      <ul className="users__list">
        {users.map((user) => (
          <UserItem key={user.id} user={user} isCurrent={user.id === currentUserId} />
        ))}
      </ul>
    </section>
  );
};

export default Users;
