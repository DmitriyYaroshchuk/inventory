import Products from '@/components/Products/Products';

const ProductsPage = async ({ searchParams }: PageProps<'/products'>) => {
  const { type } = await searchParams;

  const productType = typeof type === 'string' ? type : '';

  return <Products productType={productType} />;
};

export default ProductsPage;
