import Orders from '@/components/Orders/Orders';
import { parseId } from '@/utils/searchParams';

const OrdersPage = async ({ searchParams }: PageProps<'/orders'>) => {
  const { id } = await searchParams;
  const selectedOrderId = parseId(id);

  return <Orders selectedOrderId={selectedOrderId} />;
};
export default OrdersPage;
