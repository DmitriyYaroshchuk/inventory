'use client';

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

    return (
        <section className="warehouses">
            <h1 className="warehouses__title">Склады</h1>
            <WarehousesMap warehouses={WAREHOUSES} />
        </section>
    );
};

export default Warehouses;
