import { getTranslations } from 'next-intl/server';
import { fetchProducts, fetchProductsTypes } from '@/services/server-api';
import ProductItem from '@/components/ProductItem/ProductItem';
import ProductTypeFilter from '@/components/ProductTypeFilter/ProductTypeFilter';
import './Products.scss';

type ProductsProps = {
  productType: string;
  search: string;
};

const Products = async ({ productType, search }: ProductsProps) => {
  const t = await getTranslations('products');

  const [products, types] = await Promise.all([
    fetchProducts(productType || undefined, search || undefined),
    fetchProductsTypes(),
  ]);

  return (
    <section className="products">
      <div className="products__header">
        <h1 className="products__title">{t('title', { count: products.length })}</h1>
        <ProductTypeFilter types={types} value={productType} />
      </div>

      {products.length === 0 && <p className="text-muted">{t('empty')}</p>}

      <ul className="products__list">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
};
export default Products;
