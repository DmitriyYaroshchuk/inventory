import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import Settings from '@/components/Settings/Settings';

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  return <Settings user={currentUser} />;
};

export default SettingsPage;
