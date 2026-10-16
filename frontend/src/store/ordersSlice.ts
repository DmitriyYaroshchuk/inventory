import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type OrdersState = {
    selectedOrderId: number | null;
}

const initialState: OrdersState = {
    selectedOrderId: null
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        selectOrder: (state, action: PayloadAction<number | null>) => {
            state.selectedOrderId = action.payload;
        }
    }
});

export const { selectOrder } = ordersSlice.actions;
export default ordersSlice.reducer;