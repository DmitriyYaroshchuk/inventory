import { useTranslations } from 'next-intl';
import type messages from '../../messages/ru.json';

type ProductTypeKey = keyof (typeof messages)['productTypes'];

// типы приходят из БД на английском — возвращаем их перевод
export const useProductTypeLabel = () => {
  const t = useTranslations('productTypes');

  const getLabel = (type: string) => {
    const key = type as ProductTypeKey;

    // если перевода нет (новый тип в БД) — показываем как есть
    if (!t.has(key)) return type;

    return t(key);
  };

  return getLabel;
};
