'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTranslations } from 'next-intl';
import type { Warehouse } from '@/components/Warehouses/Warehouses';
import 'leaflet/dist/leaflet.css';
import './WarehousesMap.scss';

const UKRAINE_CENTER: [number, number] = [48.6, 31.2];
const UKRAINE_ZOOM = 6;
const WAREHOUSE_ZOOM = 13;

const markerIcon = L.divIcon({
    className: 'warehouses-map__marker',
    iconSize: [20, 20]
});

type WarehousesMapProps = {
    warehouses: Warehouse[],
    selectedWarehouse: Warehouse | null,
    onSelect: (id: number) => void
}

type FlyToWarehouseProps = {
    warehouse: Warehouse | null
}

const FlyToWarehouse = ({ warehouse }: FlyToWarehouseProps) => {
    const map = useMap();

    useEffect(() => {
        if (warehouse) {
            map.flyTo(warehouse.position, WAREHOUSE_ZOOM);
        } else {
            map.flyTo(UKRAINE_CENTER, UKRAINE_ZOOM);
        }
    }, [warehouse, map]);

    return null;
}

const WarehousesMap = ({ warehouses, selectedWarehouse, onSelect }: WarehousesMapProps) => {
    const t = useTranslations('warehouses');
    return (
        <MapContainer className="warehouses-map" center={UKRAINE_CENTER} zoom={UKRAINE_ZOOM} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToWarehouse warehouse={selectedWarehouse} />
            {
                warehouses.map((warehouse) => (
                    <Marker key={warehouse.id} position={warehouse.position} icon={markerIcon} eventHandlers={{ click: () => onSelect(warehouse.id) }}>
                        <Popup>
                            <strong>{t(`items.${warehouse.key}.title`)}</strong>
                            <br />
                            {t(`items.${warehouse.key}.address`)}
                        </Popup>

                    </Marker>
                ))
            }

        </MapContainer>
    )
}
export default WarehousesMap;