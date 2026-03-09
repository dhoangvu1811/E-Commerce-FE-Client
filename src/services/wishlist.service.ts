import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'

export interface WishlistProduct {
  id: number
  name: string
  slug: string
  image: string | null
  price: string
  discount: string | null
  rating: number | null
  stock: number
}

export interface WishlistItemResponse {
  id: number
  userId: number
  productId: number
  createdAt: string
  product: WishlistProduct
}

export interface ToggleWishlistResponse {
  action: 'added' | 'removed'
  message: string
}

export interface ToggleWishlistPayload {
  productId: number
}

export const wishlistService = {
  /** Lấy danh sách wishlist của user đã đăng nhập */
  getWishlist: () => {
    return axiosInstance.get<ApiResponse<WishlistItemResponse[]>>(
      API_ENDPOINTS.WISHLIST.GET
    )
  },

  /** Toggle (thêm hoặc xóa) sản phẩm khỏi wishlist */
  toggleWishlist: (data: ToggleWishlistPayload) => {
    return axiosInstance.post<ApiResponse<ToggleWishlistResponse>>(
      API_ENDPOINTS.WISHLIST.TOGGLE,
      data
    )
  }
}
