import Products from '@/components/Products/Products';

const ProductsPage = async ({ searchParams }: PageProps<'/products'>) => {
  const { type, q } = await searchParams;

  const productType = typeof type === 'string' ? type : '';
  const search = typeof q === 'string' ? q.trim() : '';

  return <Products productType={productType} search={search} />;
};

export default ProductsPage;
