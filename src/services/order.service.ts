import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse, PaginationInfo } from '@/types/api.type'
import type {
  Order,
  OrderFilters,
  CreateOrderPayload,
  CreateOrderResponse
} from '@/types/order.type'

export const orderService = {
  createOrder: async (payload: CreateOrderPayload) => {
    return await axiosInstance.post<ApiResponse<CreateOrderResponse>>(
      API_ENDPOINTS.ORDERS.CREATE,
      payload
    )
  },

  getMyOrders: async (params?: OrderFilters) => {
    return await axiosInstance.get<
      ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>
    >(API_ENDPOINTS.ORDERS.MY_ORDERS, { params })
  },

  getOrderDetails: async (id: number | string) => {
    return await axiosInstance.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.DETAILS(id)
    )
  },

  cancelOrder: async (id: number | string) => {
    return await axiosInstance.post<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.CANCEL(id)
    )
  }
}
