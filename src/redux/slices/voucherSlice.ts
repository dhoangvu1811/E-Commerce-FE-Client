/**
 * Voucher Slice - Client
 * Quản lý state voucher trong quá trình checkout
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { voucherService } from '@/services/voucher.service'
import type { VoucherState, VerifyVoucherPayload, Voucher } from '@/types/voucher.type'

const initialState: VoucherState = {
  activeVouchers: [],
  appliedVoucher: null,
  voucherCode: '',
  verifying: false,
  loadingActive: false,
  error: null
}

/**
 * Xác minh mã voucher + tính discount
 * Gọi khi user bấm nút "Áp dụng"
 */
export const verifyVoucher = createAsyncThunk(
  'voucher/verify',
  async (payload: VerifyVoucherPayload, { rejectWithValue }) => {
    try {
      const response = await voucherService.verifyVoucher(payload)

      return response.data.data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Mã giảm giá không hợp lệ'
      )
    }
  }
)

/**
 * Lấy danh sách voucher đang hoạt động (gợi ý cho user)
 */
export const fetchActiveVouchers = createAsyncThunk(
  'voucher/fetchActive',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      const response = await voucherService.getActiveVouchers(limit)

      return response.data.data?.vouchers as Voucher[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải danh sách voucher'
      )
    }
  }
)

const voucherSlice = createSlice({
  name: 'voucher',
  initialState,
  reducers: {
    /** Cập nhật mã voucher đang nhập */
    setVoucherCode: (state, action) => {
      state.voucherCode = action.payload

      // Khi đổi mã, xóa kết quả verify cũ
      if (state.appliedVoucher && state.appliedVoucher.voucher.code !== action.payload) {
        state.appliedVoucher = null
        state.error = null
      }
    },

    /** Xóa voucher đã áp dụng */
    removeAppliedVoucher: (state) => {
      state.appliedVoucher = null
      state.voucherCode = ''
      state.error = null
    },

    /** Xóa lỗi */
    clearVoucherError: (state) => {
      state.error = null
    },

    /** Reset toàn bộ voucher state (dùng sau khi đặt hàng xong) */
    resetVoucher: () => initialState
  },
  extraReducers: (builder) => {
    builder

      // Verify voucher
      .addCase(verifyVoucher.pending, (state) => {
        state.verifying = true
        state.error = null
        state.appliedVoucher = null
      })
      .addCase(verifyVoucher.fulfilled, (state, action) => {
        state.verifying = false
        state.appliedVoucher = action.payload
        state.error = null
      })
      .addCase(verifyVoucher.rejected, (state, action) => {
        state.verifying = false
        state.appliedVoucher = null
        state.error = action.payload as string
      })

      // Fetch active vouchers
      .addCase(fetchActiveVouchers.pending, (state) => {
        state.loadingActive = true
      })
      .addCase(fetchActiveVouchers.fulfilled, (state, action) => {
        state.loadingActive = false
        state.activeVouchers = action.payload || []
      })
      .addCase(fetchActiveVouchers.rejected, (state) => {
        state.loadingActive = false
      })
  }
})

export const {
  setVoucherCode,
  removeAppliedVoucher,
  clearVoucherError,
  resetVoucher
} = voucherSlice.actions

export default voucherSlice.reducer
