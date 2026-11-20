'use client';
import { useProductTypeLabel } from '@/hooks/useProductTypeLabel';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type ProductTypeFilterProps = {
  types: string[];
  value: string;
};

const ProductTypeFilter = ({ types, value }: ProductTypeFilterProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('products');
  const typeLabel = useProductTypeLabel();

  const handleChange = (type: string) => {
    const params = new URLSearchParams(searchParams);

    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }

    const queryStr = params.toString();
    router.push(queryStr ? `${pathName}?${queryStr}` : pathName);
  };

  return (
    <label className="products__filter">
      <span className="products__filter-label">{t('type')}</span>
      <select
        className="products__select"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">{t('all')}</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {typeLabel(type)}
          </option>
        ))}
      </select>
    </label>
  );
};
export default ProductTypeFilter;
