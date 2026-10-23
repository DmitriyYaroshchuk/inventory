'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/Loader/Loader';
import './Warehouses.scss';

export type Warehouse = {
    id: number;
    title: string;
    address: string;
    position: [number, number];
};

const WAREHOUSES: Warehouse[] = [
    { id: 1, title: 'Центральный склад', address: 'Киев, ул. Крещатик, 22', position: [50.4475, 30.524] },
    { id: 2, title: 'Склад «Запад»', address: 'Львов, пл. Рынок, 1', position: [49.8419, 24.0316] },
    { id: 3, title: 'Склад «Юг»', address: 'Одесса, ул. Дерибасовская, 1', position: [46.4843, 30.7381] },
    { id: 4, title: 'Склад «Восток»', address: 'Харьков, пл. Свободы, 5', position: [50.0055, 36.231] },
    { id: 5, title: 'Склад «Днепр»', address: 'Днепр, пр. Яворницкого, 1', position: [48.4647, 35.0462] },
];

const WarehousesMap = dynamic(() => import('@/components/WarehousesMap/WarehousesMap'), {
    ssr: false,
    loading: () => <Loader />,
});

const Warehouses = () => {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selectedWarehouse = WAREHOUSES.find((warehouse) => warehouse.id === selectedId) ?? null;

    const handleToggle = (id: number) => {
        setSelectedId((prevId) => (prevId === id ? null : id));
    };


    return (
        <section className="warehouses">
            <h1 className="warehouses__title">Склады</h1>

            <div className="warehouses__body">
                <ul className="warehouses__list">
                    {WAREHOUSES.map((warehouse) => (
                        <li key={warehouse.id}>
                            <button
                                type="button"
                                className={`warehouses__item${warehouse.id === selectedId ? ' warehouses__item--active' : ''}`}
                                onClick={() => handleToggle(warehouse.id)}
                            >
                                <span className="warehouses__name">{warehouse.title}</span>
                                <span className="warehouses__address">{warehouse.address}</span>
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
