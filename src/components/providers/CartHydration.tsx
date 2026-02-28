'use client'

/**
 * CartHydration
 *
 * Giải quyết vấn đề hydration mismatch:
 * - Server & client đều render cartItems = [] ban đầu → HTML khớp nhau ✅
 * - Sau khi client mount xong, component này mới đọc localStorage
 *   và set lại cart state → không ảnh hưởng đến quá trình hydration
 */

import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setCartItems } from '@/redux/slices/cartSlice'
import type { CartItem } from '@/redux/slices/cartSlice'

const STORAGE_KEY = 'guest_cart'

/** TTL cho guest cart: 7 ngày (ms) — phải đồng bộ với cartListenerMiddleware */
const GUEST_CART_TTL = 7 * 24 * 60 * 60 * 1000

const CartHydration = () => {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector(state => state.authReducer.isAuthenticated)

  useEffect(() => {
    // Chỉ load localStorage khi user chưa đăng nhập (guest)
    // Nếu đã đăng nhập, fetchProfile.fulfilled sẽ trigger fetchCartFromServer
    // để lấy cart chính xác từ server
    if (isAuthenticated) return

    try {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (!raw) return

      const parsed = JSON.parse(raw)
      let items: CartItem[] = []

      // Format mới: { items, savedAt }
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items)) {
        // Kiểm tra TTL — quá 7 ngày thì xóa
        if (typeof parsed.savedAt === 'number' && Date.now() - parsed.savedAt > GUEST_CART_TTL) {
          localStorage.removeItem(STORAGE_KEY)

          return
        }

        items = parsed.items
      } else if (Array.isArray(parsed)) {
        // Tương thích ngược: format cũ là mảng thuần → xóa (không có timestamp)
        localStorage.removeItem(STORAGE_KEY)

        return
      }

      if (items.length > 0) {
        dispatch(setCartItems(items))
      }
    } catch {
      // Bỏ qua nếu dữ liệu localStorage bị hỏng
    }

    // Chỉ chạy 1 lần sau khi mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default CartHydration
