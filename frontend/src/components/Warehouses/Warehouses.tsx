import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type messages from '../../../messages/ru.json';
import WarehousesMapLoader from '@/components/WarehousesMapLoader/WarehousesMapLoader';
import './Warehouses.scss';

export type WarehouseKey = keyof typeof messages.warehouses.items;

export type Warehouse = {
  id: number;
  key: WarehouseKey;
  position: [number, number];
};

const WAREHOUSES: Warehouse[] = [
  { id: 1, key: 'central', position: [50.4475, 30.524] },
  { id: 2, key: 'west', position: [49.8419, 24.0316] },
  { id: 3, key: 'south', position: [46.4843, 30.7381] },
  { id: 4, key: 'east', position: [50.0055, 36.231] },
  { id: 5, key: 'dnipro', position: [48.4647, 35.0462] },
];

type WarehousesProps = {
  selectedId: number | null;
};

const Warehouses = ({ selectedId }: WarehousesProps) => {
  const t = useTranslations('warehouses');
  const selectedWarehouse = WAREHOUSES.find((warehouse) => warehouse.id === selectedId) ?? null;

  return (
    <section className="warehouses">
      <h1 className="warehouses__title">{t('title')}</h1>

      <div className="warehouses__body">
        <ul className="warehouses__list">
          {WAREHOUSES.map((warehouse) => {
            const isActive = warehouse.id === selectedId;

            return (
              <li key={warehouse.id}>
                <Link
                  href={isActive ? '/warehouses' : `/warehouses?id=${warehouse.id}`}
                  scroll={false}
                  className={`warehouses__item${isActive ? ' warehouses__item--active' : ''}`}
                >
                  <span className="warehouses__name">{t(`items.${warehouse.key}.title`)}</span>
                  <span className="warehouses__address">{t(`items.${warehouse.key}.address`)}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <WarehousesMapLoader warehouses={WAREHOUSES} selectedWarehouse={selectedWarehouse} />
      </div>
    </section>
  );
};

export default Warehouses;
