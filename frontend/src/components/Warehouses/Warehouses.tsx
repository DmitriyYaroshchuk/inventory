'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import type messages from '../../../messages/ru.json';
import Loader from '@/components/Loader/Loader';
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

const WarehousesMap = dynamic(() => import('@/components/WarehousesMap/WarehousesMap'), {
  ssr: false,
  loading: () => <Loader />,
});

const Warehouses = () => {
  const t = useTranslations('warehouses');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedWarehouse = WAREHOUSES.find((warehouse) => warehouse.id === selectedId) ?? null;

  const handleToggle = (id: number) => {
    setSelectedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="warehouses">
      <h1 className="warehouses__title">{t('title')}</h1>

      <div className="warehouses__body">
        <ul className="warehouses__list">
          {WAREHOUSES.map((warehouse) => (
            <li key={warehouse.id}>
              <button
                type="button"
                className={`warehouses__item${warehouse.id === selectedId ? ' warehouses__item--active' : ''}`}
                onClick={() => handleToggle(warehouse.id)}
              >
                <span className="warehouses__name">{t(`items.${warehouse.key}.title`)}</span>
                <span className="warehouses__address">{t(`items.${warehouse.key}.address`)}</span>
              </button>
            </li>
          ))}
        </ul>

        <WarehousesMap
          warehouses={WAREHOUSES}
          selectedWarehouse={selectedWarehouse}
          onSelect={setSelectedId}
        />
      </div>
    </section>
  );
};

export default Warehouses;
