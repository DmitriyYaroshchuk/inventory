import { useTranslations } from 'next-intl';
import './Loader.scss';

const Loader = () => {
  const t = useTranslations('common');

  return (
    <div className="loader">
      <div className="spinner-border loader__spinner" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </div>
    </div>
  );
};

export default Loader;
