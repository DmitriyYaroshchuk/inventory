import Orders from '@/components/Orders/Orders';

const OrdersPage = async ({ searchParams }: PageProps<'/orders'>) => {
  const { id } = await searchParams;
  const parsedId = typeof id === 'string' ? Number(id) : NaN;
  const selectedOrderId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

  return <Orders selectedOrderId={selectedOrderId} />;
};
export default OrdersPage;
