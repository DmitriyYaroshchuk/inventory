import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductState = {
    productType: string;
}

const initialState: ProductState = {
    productType: '',
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProductType: (state, action: PayloadAction<string>) => {
            state.productType = action.payload;
        }
    }
});

export const { setProductType } = productsSlice.actions;
export default productsSlice.reducer;