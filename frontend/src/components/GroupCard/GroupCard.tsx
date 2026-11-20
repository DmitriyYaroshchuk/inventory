import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useProductTypeLabel } from '@/hooks/useProductTypeLabel';
import type { ProductGroup } from '@/types';
import { formatMoney, getPrice } from '@/utils/format';
import './GroupCard.scss';

type GroupCardProps = {
  group: ProductGroup;
};

const GroupCard = ({ group }: GroupCardProps) => {
  const { type, productsCount, newCount, total } = group;
  const locale = useLocale();
  const t = useTranslations('groups');
  const typeLabel = useProductTypeLabel();

  return (
    <li>
      <Link className="group-card" href={`/products?type=${encodeURIComponent(type)}`}>
        <h2 className="group-card__title">{typeLabel(type)}</h2>
        <span className="group-card__count">{t('productsCount', { count: productsCount })}</span>

        <div className="group-card__states">
          <span className="group-card__state group-card__state--new">
            {t('newCount', { count: newCount })}
          </span>
          <span className="group-card__state">
            {t('usedCount', { count: productsCount - newCount })}
          </span>
        </div>

        <div className="group-card__total">
          <span className="group-card__muted">{formatMoney(getPrice(total, 'USD'), locale)} $</span>
          <span>{formatMoney(getPrice(total, 'UAH'), locale)} UAH</span>
        </div>
      </Link>
    </li>
  );
};

export default GroupCard;
