import { getTranslations } from 'next-intl/server';
import { fetchProductGroups } from '@/services/server-api';
import GroupCard from '@/components/GroupCard/GroupCard';
import './Groups.scss';

const Groups = async () => {
  const t = await getTranslations('groups');
  const groups = await fetchProductGroups();

  return (
    <section className="groups">
      <h1 className="groups__title">{t('title', { count: groups.length })}</h1>

      {groups.length === 0 && <p className="text-muted">{t('empty')}</p>}

      <ul className="groups__list">
        {groups.map((group) => (
          <GroupCard key={group.type} group={group} />
        ))}
      </ul>
    </section>
  );
};

export default Groups;
