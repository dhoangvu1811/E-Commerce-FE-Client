import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'

import toast from 'react-hot-toast'

import type { RootState } from '../store'
import { cartService } from '@/services/cart.service'
import type { CartResponse } from '@/services/cart.service'

import { logout } from './authSlice'




export type CartItem = {
  id: number
  name: string
  price: number
  discountedPrice: number
  quantity: number
  image: string
  stock: number
}

type InitialState = {
  cartItems: CartItem[]
  syncing: boolean
}

const initialState: InitialState = {
  cartItems: [],
  syncing: false
}


/**
 * Lấy giỏ hàng từ server.
 * Trả về mappedItems → extraReducers.fulfilled sẽ set vào state.
 */
export const fetchCartFromServer = createAsyncThunk(
  'cart/fetchFromServer',
  async (): Promise<CartItem[]> => {
    const response = await cartService.getCart()
    const serverItems = response.data.data.items

    const mappedItems: CartItem[] = serverItems.map((item) => {
      const p = Number(item.product.price)
      const d = Number(item.product.discount || 0)

      return {
        id: item.product.id,
        name: item.product.name,
        price: p,
        discountedPrice: d > 0 ? p * (1 - d / 100) : p,
        quantity: item.quantity,
        image: item.product.image || '/images/product/product-01.png',
        stock: item.product.stock
      }
    })

    // Không ghi server cart vào localStorage (guest_cart)
    // localStorage chỉ dùng cho giỏ hàng khách vãng lai (guest)
    // Nếu ghi server cart vào đây, khi session hết hạn và user đăng nhập lại,
    // dữ liệu cũ sẽ bị sync lại → nhân đôi quantity

    return mappedItems
  }
)

/**
 * Đồng bộ giỏ hàng guest lên server sau khi đăng nhập,
 * sau đó fetch cart mới nhất từ server.
 */
export const syncGuestCartToServer = createAsyncThunk(
  'cart/syncGuestToServer',
  async (guestItems: CartItem[], { dispatch }) => {
    if (guestItems.length > 0) {
      const response = await cartService.syncCart({
        items: guestItems.map((i) => ({ productId: i.id, quantity: i.quantity }))
      })

      // Hiển thị thông báo nếu có sản phẩm bị điều chỉnh số lượng do vượt tồn kho
      const syncData = response.data.data as CartResponse

      if (syncData.adjustedItems && syncData.adjustedItems.length > 0) {
        const names = syncData.adjustedItems
          .map((a) => `"${a.productName}" (điều chỉnh về ${a.adjustedQty})`)
          .join(', ')

        toast(`Một số sản phẩm đã được điều chỉnh do vượt tồn kho: ${names}`, {
          icon: '⚠️',
          duration: 5000
        })
      }
    }

    await dispatch(fetchCartFromServer())
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, name, price, quantity, discountedPrice, image, stock } = action.payload
      const existingItem = state.cartItems.find((item) => item.id === id)

      if (existingItem) {
        // Giới hạn không vượt quá stock
        existingItem.quantity = Math.min(existingItem.quantity + quantity, stock)
        existingItem.stock = stock // Cập nhật stock mới nhất
      } else {
        const safeQuantity = Math.min(quantity, stock)

        if (safeQuantity > 0) {
          state.cartItems.push({ id, name, price, quantity: safeQuantity, discountedPrice, image, stock })
        }
      }
    },

    removeItemFromCart: (state, action: PayloadAction<number>) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== action.payload)
    },

    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity = action.payload.quantity
      }
    },

    removeAllItemsFromCart: (state) => {
      state.cartItems = []
    },

    /** Thay thế toàn bộ giỏ hàng (dùng trực tiếp khi cần, vd: reset) */
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.cartItems = action.payload
    }
  },
  extraReducers: (builder) => {
    builder

      // fetchCartFromServer: fulfilled → cập nhật state từ payload trả về
      .addCase(fetchCartFromServer.pending, (state) => {
        state.syncing = true
      })
      .addCase(fetchCartFromServer.fulfilled, (state, action) => {
        state.syncing = false
        state.cartItems = action.payload
      })
      .addCase(fetchCartFromServer.rejected, (state) => {
        state.syncing = false
      })

      // syncGuestCartToServer
      .addCase(syncGuestCartToServer.pending, (state) => {
        state.syncing = true
      })
      .addCase(syncGuestCartToServer.fulfilled, (state) => {
        state.syncing = false
      })
      .addCase(syncGuestCartToServer.rejected, (state) => {
        state.syncing = false
      })

      // Logout: xóa toàn bộ cart trong Redux để tránh data cũ
      // khi user thêm guest items sau khi logout sẽ không bị lẫn với session cũ
      .addCase(logout.fulfilled, (state) => {
        state.cartItems = []
        state.syncing = false
      })
  }
})

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectCartItems = (state: RootState) => state.cartReducer.cartItems

export const selectCartSyncing = (state: RootState) => state.cartReducer.syncing

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => total + item.discountedPrice * item.quantity, 0)
})

// ─── Exports ──────────────────────────────────────────────────────────────────

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  setCartItems
} = cart.actions

export default cart.reducer
