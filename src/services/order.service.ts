import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import { ApiResponse, PaginationInfo } from '@/types/api.type'
import { Order, OrderFilters } from '@/types/order.type'

export const orderService = {
  getMyOrders: async (params?: OrderFilters) => {
    return await axiosInstance.get<
      ApiResponse<{ orders: Order[]; pagination: PaginationInfo }>
    >(API_ENDPOINTS.ORDERS.MY_ORDERS, { params })
  },

  getOrderDetails: async (id: number) => {
    return await axiosInstance.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDERS.DETAILS.replace(':id', String(id))
    )
  },

  cancelOrder: async (id: number) => {
    return await axiosInstance.post<ApiResponse<void>>(
      API_ENDPOINTS.ORDERS.CANCEL.replace(':id', String(id))
    )
  }
}
