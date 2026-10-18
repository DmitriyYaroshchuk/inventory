'use client';

import { useGetProductsQuery, useGetProductTypesQuery } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setProductType } from '@/store/productsSlice';
import ProductItem from '@/components/ProductItem/ProductItem';
import './Products.scss';

const Products = () => {
    const dispatch = useAppDispatch();
    const productsType = useAppSelector((state) => state.products.productType);

    const { data: types = [] } = useGetProductTypesQuery();
    const {
        data: products = [],
        isLoading,
        isError,
    } = useGetProductsQuery(productsType || undefined);

    return (
        <section className="products">
            <div className="products__header">
                <h1 className="products__title">Продукты / {products.length}</h1>

                <label className="products__filter">
                    <span className="products__filter-label">Тип:</span>
                    <select
                        className="products__select"
                        value={productsType}
                        onChange={(e) => dispatch(setProductType(e.target.value))}
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

            {isLoading && <p>Загрузка...</p>}
            {isError && <p>Не удалось загрузить продукты</p>}

            <ul className="products__list">
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </ul>
        </section>
    );
};

export default Products;