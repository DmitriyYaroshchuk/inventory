import { api } from '@/services/api';
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';
import productsReducer from './productsSlice';
import authReducer from './authSlice';


export const makeStore = () =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth: authReducer,
      orders: ordersReducer,
      products: productsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
