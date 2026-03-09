import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import type { RootState } from '../store'
import { wishlistService } from '@/services/wishlist.service'
import type { WishlistItemResponse } from '@/services/wishlist.service'
import { logout } from './authSlice'

export type { WishlistItemResponse as WishlistItem }

type WishlistState = {
  items: WishlistItemResponse[]
  loading: boolean
  error: string | null
  toggling: number[]  // danh sách productId đang trong quá trình toggle
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  toggling: []
}

/**
 * Lấy danh sách wishlist từ server (dành cho user đã đăng nhập)
 */
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchFromServer',
  async (): Promise<WishlistItemResponse[]> => {
    const response = await wishlistService.getWishlist()

    return response.data.data
  }
)

/**
 * Toggle sản phẩm trong wishlist (thêm nếu chưa có, xóa nếu đã có)
 */
export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleItem',
  async (productId: number): Promise<{ productId: number; action: 'added' | 'removed' }> => {
    const response = await wishlistService.toggleWishlist({ productId })

    return { productId, action: response.data.data.action }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.items = action.payload
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false
        state.error = 'Không thể tải danh sách yêu thích. Vui lòng thử lại.'
      })

      // toggleWishlistItem
      .addCase(toggleWishlistItem.pending, (state, action) => {
        // action.meta.arg là productId
        state.toggling.push(action.meta.arg)
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        const { productId, action: toggleAction } = action.payload

        // Xóa khỏi danh sách đang toggle
        state.toggling = state.toggling.filter((id) => id !== productId)

        if (toggleAction === 'removed') {
          state.items = state.items.filter((item) => item.productId !== productId)
          toast.success('Đã xóa khỏi danh sách yêu thích')
        } else {
          // Đã thêm thành công → refetch để lấy data đầy đủ (được xử lý ở component)
          toast.success('Đã thêm vào danh sách yêu thích')
        }
      })
      .addCase(toggleWishlistItem.rejected, (state, action) => {
        const productId = action.meta.arg

        // axiosInstance interceptor đã show toast.error → không show thêm ở đây để tránh duplicate
        state.toggling = state.toggling.filter((id) => id !== productId)
      })

      // Logout: xóa toàn bộ wishlist trong Redux
      .addCase(logout.fulfilled, (state) => {
        state.items = []
        state.loading = false
        state.error = null
        state.toggling = []
      })
  }
})

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectWishlistItems = (state: RootState) => state.wishlistReducer.items

export const selectWishlistCount = (state: RootState) => state.wishlistReducer.items.length

export const selectWishlistLoading = (state: RootState) => state.wishlistReducer.loading

export const selectWishlistError = (state: RootState) => state.wishlistReducer.error

export const selectWishlistToggling = (state: RootState) => state.wishlistReducer.toggling

/** Kiểm tra một productId có trong wishlist không */
export const selectIsInWishlist = (productId: number) =>
  createSelector(
    [selectWishlistItems],
    (items) => items.some((item) => item.productId === productId)
  )

/** Kiểm tra một productId có đang trong quá trình toggle không */
export const selectIsToggling = (productId: number) =>
  createSelector(
    [selectWishlistToggling],
    (toggling) => toggling.includes(productId)
  )

export default wishlistSlice.reducer
