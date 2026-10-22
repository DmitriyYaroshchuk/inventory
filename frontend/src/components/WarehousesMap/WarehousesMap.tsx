'use client';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import type { Warehouse } from '@/components/Warehouses/Warehouses';
import 'leaflet/dist/leaflet.css';
import './WarehousesMap.scss';

const UKRAINE_CENTER: [number, number] = [48.6, 31.2];

const markerIcon = L.divIcon({
    className: 'warehouses-map__marker',
    iconSize: [20, 20]
});

type WarehousesMapProps = {
    warehouses: Warehouse[]
}

const WarehousesMap = ({ warehouses }: WarehousesMapProps) => {
    return (
        <MapContainer className="warehouses-map" center={UKRAINE_CENTER} zoom={6} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                warehouses.map((warehouse) => (
                    <Marker key={warehouse.id} position={warehouse.position} icon={markerIcon}>
                        <Popup>
                            <strong>{warehouse.title}</strong>
                            <br />
                            {warehouse.address}
                        </Popup>

                    </Marker>
                ))
            }

        </MapContainer>
    )
}
export default WarehousesMap;