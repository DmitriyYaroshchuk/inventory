import Warehouses from '@/components/Warehouses/Warehouses';
import { parseId } from '@/utils/searchParams';

const WarehousesPage = async ({ searchParams }: PageProps<'/warehouses'>) => {
  const { id } = await searchParams;

  const selectedId = parseId(id);

  return <Warehouses selectedId={selectedId} />;
};

export default WarehousesPage;
