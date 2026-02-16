import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'
import type {
  ShippingAddressItem,
  CreateShippingAddressPayload,
  UpdateShippingAddressPayload
} from '@/types/shippingAddress.type'

export const shippingAddressService = {
  getMyAddresses: async () => {
    return await axiosInstance.get<ApiResponse<ShippingAddressItem[]>>(
      API_ENDPOINTS.SHIPPING_ADDRESSES.LIST
    )
  },

  createAddress: async (payload: CreateShippingAddressPayload) => {
    return await axiosInstance.post<ApiResponse<ShippingAddressItem>>(
      API_ENDPOINTS.SHIPPING_ADDRESSES.CREATE,
      payload
    )
  },

  updateAddress: async (id: number, payload: UpdateShippingAddressPayload) => {
    return await axiosInstance.put<ApiResponse<ShippingAddressItem>>(
      API_ENDPOINTS.SHIPPING_ADDRESSES.UPDATE(id),
      payload
    )
  },

  deleteAddress: async (id: number) => {
    return await axiosInstance.delete<ApiResponse<void>>(
      API_ENDPOINTS.SHIPPING_ADDRESSES.DELETE(id)
    )
  },

  setDefaultAddress: async (id: number) => {
    return await axiosInstance.patch<ApiResponse<ShippingAddressItem>>(
      API_ENDPOINTS.SHIPPING_ADDRESSES.SET_DEFAULT(id)
    )
  }
}
