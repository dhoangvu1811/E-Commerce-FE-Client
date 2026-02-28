/**
 * Cart Listener Middleware
 *
 * Chịu trách nhiệm:
 * 1. Persist giỏ hàng vào localStorage sau mỗi thay đổi
 * 2. Gọi Cart API khi user đã đăng nhập (optimistic update)
 * 3. Đồng bộ giỏ guest → server ngay khi login.fulfilled
 * 4. Load cart từ server khi fetchProfile.fulfilled (page reload đã login) — chỉ khi không đang sync
 * 5. Xóa localStorage khi logout
 */

import { createListenerMiddleware } from '@reduxjs/toolkit'

import type { RootState, AppDispatch } from '../store'
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  fetchCartFromServer,
  syncGuestCartToServer,
  type CartItem
} from '../slices/cartSlice'
import { login, logout, fetchProfile } from '../slices/authSlice'
import { cartService } from '@/services/cart.service'

export const cartListenerMiddleware = createListenerMiddleware()

// ─── Helper ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'guest_cart'

/** TTL cho guest cart: 7 ngày (ms) */
const GUEST_CART_TTL = 7 * 24 * 60 * 60 * 1000

/**
 * Lưu giỏ hàng guest vào localStorage kèm timestamp.
 * Format: { items: CartItem[], savedAt: number }
 */
const persistCartToStorage = (state: RootState) => {
  if (typeof window === 'undefined') return

  try {
    const payload = {
      items: state.cartReducer.cartItems,
      savedAt: Date.now()
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Bỏ qua lỗi localStorage (ví dụ: private mode)
  }
}

/**
 * Đọc guest cart từ localStorage — đáng tin cậy hơn Redux state
 * khi có concurrent async listeners có thể ghi đè state trước khi login listener đọc.
 *
 * Kiểm tra TTL: nếu dữ liệu quá 7 ngày → xóa và trả về [].
 * Tương thích ngược: nếu dữ liệu cũ là mảng thuần (chưa có savedAt) → coi là hết hạn.
 */
const readGuestCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return []

    const parsed = JSON.parse(raw)

    // Format mới: { items, savedAt }
    if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
      // Kiểm tra TTL
      if (typeof parsed.savedAt === 'number' && Date.now() - parsed.savedAt > GUEST_CART_TTL) {
        localStorage.removeItem(STORAGE_KEY)

        return []
      }

      return parsed.items
    }

    // Tương thích ngược: format cũ là mảng thuần → xóa (coi như hết hạn vì không có timestamp)
    if (Array.isArray(parsed)) {
      localStorage.removeItem(STORAGE_KEY)
      
      return []
    }

    return []
  } catch {
    return []
  }
}

// ─── Thêm sản phẩm ───────────────────────────────────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: addItemToCart,
  effect: async (action, api) => {
    const state = api.getState() as RootState

    // Chỉ persist vào localStorage khi user chưa đăng nhập (guest)
    // Tránh ghi server cart vào guest_cart → nhân đôi quantity khi sync
    if (!state.authReducer.isAuthenticated) {
      persistCartToStorage(state)
    }

    if (state.authReducer.isAuthenticated) {
      try {
        await cartService.addToCart({
          productId: action.payload.id,
          quantity: action.payload.quantity
        })
      } catch {
        // Silent fail — state local đã cập nhật, lần sau sync sẽ bắt kịp
      }
    }
  }
})

// ─── Xóa một sản phẩm ────────────────────────────────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: removeItemFromCart,
  effect: async (action, api) => {
    const state = api.getState() as RootState

    // Chỉ persist vào localStorage khi là guest
    if (!state.authReducer.isAuthenticated) {
      persistCartToStorage(state)
    }

    if (state.authReducer.isAuthenticated) {
      try {
        await cartService.removeFromCart(action.payload)
      } catch {}
    }
  }
})

// ─── Cập nhật số lượng ───────────────────────────────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: updateCartItemQuantity,
  effect: async (action, api) => {
    const state = api.getState() as RootState

    // Chỉ persist vào localStorage khi là guest
    if (!state.authReducer.isAuthenticated) {
      persistCartToStorage(state)
    }

    if (state.authReducer.isAuthenticated) {
      try {
        await cartService.updateCart({
          productId: action.payload.id,
          quantity: action.payload.quantity
        })
      } catch {}
    }
  }
})

// ─── Xóa toàn bộ giỏ (Clear Cart button) ────────────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: removeAllItemsFromCart,
  effect: async (_action, api) => {
    const state = api.getState() as RootState

    // Chỉ persist vào localStorage khi là guest
    if (!state.authReducer.isAuthenticated) {
      persistCartToStorage(state) // Ghi mảng rỗng vào localStorage
    }

    if (state.authReducer.isAuthenticated) {
      try {
        await cartService.clearCart()
      } catch {}
    }
  }
})

// ─── Sau khi login: đồng bộ guest cart → server ──────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: login.fulfilled,
  effect: async (_action, api) => {
    // Đọc từ localStorage thay vì Redux state để tránh race condition:
    // Các listener khác (fetchProfile.fulfilled → fetchCartFromServer) có thể
    // đã ghi đè state trước khi listener này chạy xong async workflow của nó.
    const storageItems = readGuestCartFromStorage()
    const reduxState = api.getState() as RootState
    const reduxItems = reduxState.cartReducer.cartItems

    // Lấy danh sách đầy đủ nhất — ưu tiên localStorage hoặc Redux tùy cái nào nhiều hơn
    const guestItems = storageItems.length >= reduxItems.length ? storageItems : reduxItems

    // Xóa localStorage ngay lập tức để ngăn fetchProfile.fulfilled (nếu cùng lúc)
    // fetch server cart rỗng rồi ghi đè localStorage guest items
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }

    await (api.dispatch as AppDispatch)(syncGuestCartToServer(guestItems))
  }
})

// ─── Sau khi fetchProfile (page reload đã login): load cart từ server ────────

cartListenerMiddleware.startListening({
  actionCreator: fetchProfile.fulfilled,
  effect: async (_action, api) => {
    const state = api.getState() as RootState

    // Bỏ qua nếu đang trong quá trình sync (login.fulfilled listener đang chạy)
    // để tránh fetchCartFromServer ghi đè guest cart chưa được sync lên server
    if (state.cartReducer.syncing) return

    await (api.dispatch as AppDispatch)(fetchCartFromServer())
  }
})

// ─── Sau khi logout: xóa localStorage ───────────────────────────────────────

cartListenerMiddleware.startListening({
  actionCreator: logout.fulfilled,
  effect: async (_action, _api) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})

