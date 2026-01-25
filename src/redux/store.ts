import { configureStore } from '@reduxjs/toolkit'

import quickViewReducer from './slices/quickViewSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import productDetailsReducer from './slices/productDetailsSlice'
import productsReducer from './slices/productsSlice'
import categoriesReducer from './slices/categorySlice'
import authReducer from './slices/authSlice'
import orderReducer from './slices/orderSlice'

import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux'
import { injectStore } from '@/apis/axiosInstance'

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
    productsReducer,
    categoriesReducer,
    authReducer,
    orderReducer
  }
})

// Inject store to axios instance to avoid circular dependency
injectStore(store) // Added call to injectStore

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
