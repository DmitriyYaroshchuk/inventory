import Orders from '@/components/Orders/Orders';
import { parseId } from '@/utils/searchParams';

const OrdersPage = async ({ searchParams }: PageProps<'/orders'>) => {
  const { id, q } = await searchParams;
  const selectedOrderId = parseId(id);
  const search = typeof q === 'string' ? q.trim() : '';

  return <Orders selectedOrderId={selectedOrderId} search={search} />;
};
export default OrdersPage;
