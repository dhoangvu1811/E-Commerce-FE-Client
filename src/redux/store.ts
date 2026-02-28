import { configureStore } from '@reduxjs/toolkit'

import type { TypedUseSelectorHook} from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'

import quickViewReducer from './slices/quickViewSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import productDetailsReducer from './slices/productDetailsSlice'
import productsReducer from './slices/productsSlice'
import categoriesReducer from './slices/categorySlice'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'
import shippingAddressReducer from './slices/shippingAddressSlice'
import voucherReducer from './slices/voucherSlice'
import notificationReducer from './slices/notificationSlice'

import { cartListenerMiddleware } from './middleware/cartListenerMiddleware'
import { injectStore } from '@/apis/axiosInstance'

// store khởi tạo với cartItems = [] trên cả server lẫn client
// → tránh hydration mismatch
// localStorage được load sau khi mount qua CartHydration component
export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
    productsReducer,
    categoriesReducer,
    authReducer,
    orderReducer,
    shippingAddressReducer,
    voucherReducer,
    notificationReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(cartListenerMiddleware.middleware)
})

// Inject store to axios instance to avoid circular dependency
injectStore(store) // Added call to injectStore

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
