'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGetProductsQuery, useGetProductTypesQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProductType } from '@/store/productsSlice';
import { loadProductTypeFromLS, saveProductTypeToLS } from '@/utils/storage';
import ProductItem from '@/components/ProductItem/ProductItem';
import Loader from '@/components/Loader/Loader';
import './Products.scss';

const Products = () => {
  const dispatch = useAppDispatch();
  const productType = useAppSelector((state) => state.products.productType);
  const t = useTranslations('products');

  useEffect(() => {
    const savedType = loadProductTypeFromLS();
    if (savedType) dispatch(setProductType(savedType));
  }, [dispatch]);

  const handleTypeChange = (type: string) => {
    dispatch(setProductType(type));
    saveProductTypeToLS(type);
  };

  const { data: types = [], isSuccess: isTypesLoaded } = useGetProductTypesQuery();
  const { data: products = [], isLoading, isError } = useGetProductsQuery(productType || undefined);

  useEffect(() => {
    if (isTypesLoaded && productType && !types.includes(productType)) {
      dispatch(setProductType(''));
      saveProductTypeToLS('');
    }
  }, [isTypesLoaded, types, productType, dispatch]);

  return (
    <section className="products">
      <div className="products__header">
        <h1 className="products__title">{t('title', { count: products.length })}</h1>

        <label className="products__filter">
          <span className="products__filter-label">{t('type')}</span>
          <select
            className="products__select"
            value={productType}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="">{t('all')}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <Loader />}
      {isError && (
        <div className="alert alert-danger" role="alert">
          {t('loadError')}
        </div>
      )}
      {!isLoading && !isError && products.length === 0 && (
        <p className="text-muted">{t('empty')}</p>
      )}

      <ul className="products__list">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
};

export default Products;
