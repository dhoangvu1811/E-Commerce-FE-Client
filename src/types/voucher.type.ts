/**
 * Voucher Types - Client side
 * Kiểu dữ liệu cho module voucher phía client
 */

export type VoucherDiscountType = 'percent' | 'fixed'

/** Thông tin voucher trả về từ BE */
export interface Voucher {
  id: number
  code: string
  type: VoucherDiscountType
  amount: number
  maxDiscount: number | null
  minOrderValue: number | null
  usageLimit: number | null
  usedCount: number
  startDate: string | null
  endDate: string | null
  isActive: boolean
  description: string | null
  createdAt: string
  updatedAt: string
}

/** Request body cho verify voucher */
export interface VerifyVoucherPayload {
  code: string
  orderTotal: number
}

/** Response data từ verify endpoint */
export interface VerifyVoucherResult {
  voucher: Voucher
  discount: number
  payable: number
}

/** Redux state */
export interface VoucherState {

  /** Danh sách voucher đang hoạt động (cho gợi ý) */
  activeVouchers: Voucher[]

  /** Kết quả verify voucher hiện tại */
  appliedVoucher: VerifyVoucherResult | null

  /** Mã voucher đang được nhập/áp dụng */
  voucherCode: string

  /** Đang gọi verify API */
  verifying: boolean

  /** Đang fetch danh sách active */
  loadingActive: boolean

  /** Lỗi verify */
  error: string | null
}
