'use client';

import dynamic from 'next/dynamic';
import Loader from '@/components/Loader/Loader';

const WarehousesMapLoader = dynamic(() => import('@/components/WarehousesMap/WarehousesMap'), {
  ssr: false,
  loading: () => <Loader />,
});

export default WarehousesMapLoader;
