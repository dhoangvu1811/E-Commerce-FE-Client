/**
 * Voucher Service - Client
 * Các API call liên quan đến voucher phía client
 */

import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'
import type { Voucher, VerifyVoucherPayload, VerifyVoucherResult } from '@/types/voucher.type'

export const voucherService = {
  /**
   * Xác minh mã voucher và tính toán giảm giá
   * Public endpoint - không cần đăng nhập
   */
  verifyVoucher: async (payload: VerifyVoucherPayload) => {
    return await axiosInstance.post<ApiResponse<VerifyVoucherResult>>(
      API_ENDPOINTS.VOUCHERS.VERIFY,
      payload
    )
  },

  /**
   * Lấy danh sách voucher đang hoạt động (dùng để gợi ý)
   * Public endpoint - không cần đăng nhập
   */
  getActiveVouchers: async (limit?: number) => {
    return await axiosInstance.get<ApiResponse<{ vouchers: Voucher[]; pagination: object }>>(
      API_ENDPOINTS.VOUCHERS.ACTIVE,
      { params: limit ? { limit } : undefined }
    )
  }
}
