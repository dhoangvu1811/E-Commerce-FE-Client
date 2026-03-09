/**
 * Wishlist Listener Middleware
 *
 * Chịu trách nhiệm:
 * 1. Fetch wishlist từ server sau khi login (login.fulfilled)
 * 2. Fetch wishlist từ server khi reload trang đã đăng nhập (fetchProfile.fulfilled)
 * 3. Wishlist đã được clear khi logout thông qua extraReducers trong wishlistSlice
 *
 * Sau khi toggleWishlistItem.fulfilled với action = 'added',
 * cần refetch để lấy đầy đủ thông tin sản phẩm mới được thêm.
 */

import { createListenerMiddleware } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '../store'
import { fetchWishlist, toggleWishlistItem } from '../slices/wishlistSlice'
import { login, fetchProfile } from '../slices/authSlice'

export const wishlistListenerMiddleware = createListenerMiddleware()

// ─── Fetch wishlist sau khi đăng nhập ────────────────────────────────────────

wishlistListenerMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: async (_action, api) => {
    const dispatch = api.dispatch as AppDispatch

    try {
      await dispatch(fetchWishlist())
    } catch {
      // Silent fail
    }
  }
})

// ─── Fetch wishlist khi reload trang đã đăng nhập ────────────────────────────

wishlistListenerMiddleware.startListening({
  actionCreator: fetchProfile.fulfilled,
  effect: async (_action, api) => {
    const dispatch = api.dispatch as AppDispatch
    const state = api.getState() as RootState

    // Chỉ fetch khi chưa có dữ liệu để tránh gọi thừa
    if (state.wishlistReducer.items.length === 0) {
      try {
        await dispatch(fetchWishlist())
      } catch {
        // Silent fail
      }
    }
  }
})

// ─── Refetch wishlist sau khi toggle thêm thành công ─────────────────────────

wishlistListenerMiddleware.startListening({
  actionCreator: toggleWishlistItem.fulfilled,
  effect: async (action, api) => {
    const dispatch = api.dispatch as AppDispatch

    // Nếu vừa thêm → fetch lại để có đầy đủ thông tin sản phẩm
    if (action.payload.action === 'added') {
      try {
        await dispatch(fetchWishlist())
      } catch {
        // Silent fail
      }
    }
  }
})
