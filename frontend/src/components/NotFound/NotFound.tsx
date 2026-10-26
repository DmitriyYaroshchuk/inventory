import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import './NotFound.scss';

const NotFound = async () => {
  const t = await getTranslations('notFound');

  return (
    <section className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">{t('title')}</h1>
      <p className="not-found__text">{t('text')}</p>
      <Link className="not-found__link" href="/orders">
        {t('home')}
      </Link>
    </section>
  );
};

export default NotFound;
