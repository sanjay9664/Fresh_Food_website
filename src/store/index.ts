import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import catalogReducer from './slices/catalogSlice';

export const store = configureStore({
  reducer: { auth: authReducer, cart: cartReducer, catalog: catalogReducer },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
