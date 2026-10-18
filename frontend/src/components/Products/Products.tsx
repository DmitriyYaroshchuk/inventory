'use client';

import { useGetProductsQuery, useGetProductTypesQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProductType } from '@/store/productsSlice';
import ProductItem from '@/components/ProductItem/ProductItem';
import Loader from '@/components/Loader/Loader';
import './Products.scss';
import { useEffect } from 'react';
import { loadProductTypeFromLS, saveProductTypeToLS } from '@/utils/storage';

const Products = () => {
    const dispatch = useAppDispatch();
    const productType = useAppSelector((state) => state.products.productType);

    useEffect(() => {
        const savedType = loadProductTypeFromLS();
        if (savedType) dispatch(setProductType(savedType));
    }, [dispatch]);

    const handleTypeChange = (type: string) => {
        dispatch(setProductType(type));
        saveProductTypeToLS(type);
    }

    const { data: types = [] } = useGetProductTypesQuery();
    const {
        data: products = [],
        isLoading,
        isError,
    } = useGetProductsQuery(productType || undefined);

    return (
        <section className="products">
            <div className="products__header">
                <h1 className="products__title">Продукты / {products.length}</h1>

                <label className="products__filter">
                    <span className="products__filter-label">Тип:</span>
                    <select
                        className="products__select"
                        value={productType}
                        onChange={(e) => handleTypeChange(e.target.value)}
                    >
                        <option value="">Все</option>
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
                    Не удалось загрузить продукты. Проверьте, что сервер запущен.
                </div>
            )}
            {!isLoading && !isError && products.length === 0 && (
                <p className="text-muted">Продуктов нет</p>
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