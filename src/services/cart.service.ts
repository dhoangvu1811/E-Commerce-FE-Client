import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'

export interface CartItemResponse {
  id: number
  userId: number
  productId: number
  quantity: number
  product: {
    id: number
    name: string
    slug: string
    image: string | null
    price: string
    discount: string | null
    stock: number
    status: string
  }
}

export interface CartResponse {
  items: CartItemResponse[]
  totalPrice: number
  totalItems: number

  /** Danh sách sản phẩm bị điều chỉnh số lượng do vượt tồn kho (chỉ có trong response của sync) */
  adjustedItems?: { productName: string; requestedQty: number; adjustedQty: number }[]
}

export interface AddToCartPayload {
  productId: number
  quantity: number
}

export interface UpdateCartPayload {
  productId: number
  quantity: number
}

export interface SyncCartPayload {
  items: { productId: number; quantity: number }[]
}

export const cartService = {
  /** Lấy giỏ hàng của user đã đăng nhập */
  getCart: () => {
    return axiosInstance.get<ApiResponse<CartResponse>>(API_ENDPOINTS.CART.GET)
  },

  /** Thêm sản phẩm vào giỏ hàng (server) */
  addToCart: (data: AddToCartPayload) => {
    return axiosInstance.post<ApiResponse<CartItemResponse>>(API_ENDPOINTS.CART.ADD, data)
  },

  /** Cập nhật số lượng (server) */
  updateCart: (data: UpdateCartPayload) => {
    return axiosInstance.put<ApiResponse<CartItemResponse>>(API_ENDPOINTS.CART.UPDATE, data)
  },

  /** Xóa sản phẩm khỏi giỏ (server) */
  removeFromCart: (productId: number) => {
    return axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.CART.REMOVE(productId))
  },

  /** Đồng bộ giỏ hàng guest vào tài khoản sau khi đăng nhập */
  syncCart: (data: SyncCartPayload) => {
    return axiosInstance.post<ApiResponse<CartResponse>>(API_ENDPOINTS.CART.SYNC, data)
  },

  /** Xóa toàn bộ giỏ hàng trên server */
  clearCart: () => {
    return axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.CART.CLEAR)
  }
}
