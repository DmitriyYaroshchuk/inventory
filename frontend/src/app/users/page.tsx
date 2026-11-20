import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Users from '@/components/Users/Users';

const UsersPage = async ({ searchParams }: PageProps<'/users'>) => {
  // страница только для вошедших: проверяем на сервере ещё до рендера
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const { q } = await searchParams;
  const search = typeof q === 'string' ? q.trim() : '';

  return <Users currentUserId={currentUser.id} search={search} />;
};

export default UsersPage;
