import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { shippingAddressService } from '@/services/shippingAddress.service'
import type {
  ShippingAddressItem,
  CreateShippingAddressPayload,
  UpdateShippingAddressPayload
} from '@/types/shippingAddress.type'
import type { RootState } from '../store'

// ================== State ==================
interface ShippingAddressState {
  addresses: ShippingAddressItem[]
  loading: boolean
  error: string | null
}

const initialState: ShippingAddressState = {
  addresses: [],
  loading: false,
  error: null
}

// ================== Thunks ==================
export const fetchMyAddresses = createAsyncThunk(
  'shippingAddress/fetchMyAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await shippingAddressService.getMyAddresses()

      
return res.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải danh sách địa chỉ'
      )
    }
  }
)

export const createAddress = createAsyncThunk(
  'shippingAddress/createAddress',
  async (payload: CreateShippingAddressPayload, { rejectWithValue }) => {
    try {
      const res = await shippingAddressService.createAddress(payload)

      
return res.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tạo địa chỉ'
      )
    }
  }
)

export const updateAddress = createAsyncThunk(
  'shippingAddress/updateAddress',
  async (
    { id, payload }: { id: number; payload: UpdateShippingAddressPayload },
    { rejectWithValue }
  ) => {
    try {
      const res = await shippingAddressService.updateAddress(id, payload)

      
return res.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể cập nhật địa chỉ'
      )
    }
  }
)

export const deleteAddress = createAsyncThunk(
  'shippingAddress/deleteAddress',
  async (id: number, { rejectWithValue }) => {
    try {
      await shippingAddressService.deleteAddress(id)
      
return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể xóa địa chỉ'
      )
    }
  }
)

export const setDefaultAddress = createAsyncThunk(
  'shippingAddress/setDefaultAddress',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await shippingAddressService.setDefaultAddress(id)

      
return res.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể đặt địa chỉ mặc định'
      )
    }
  }
)

// ================== Slice ==================
const shippingAddressSlice = createSlice({
  name: 'shippingAddress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchMyAddresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyAddresses.fulfilled, (state, action) => {
        state.loading = false

        // Defensive: validate payload is array
        state.addresses = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchMyAddresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

    // Create
    builder
      .addCase(createAddress.fulfilled, (state, action) => {
        const newAddr = action.payload


        // Defensive: validate payload exists
        if (!newAddr) return
        
        // Nếu new address isDefault → reset all others
        if (newAddr.isDefault) {
          state.addresses.forEach((a) => (a.isDefault = false))
        }

        state.addresses.unshift(newAddr)
      })

    // Update
    builder
      .addCase(updateAddress.fulfilled, (state, action) => {
        const updated = action.payload


        // Defensive: validate payload exists
        if (!updated) return
        
        const originalId = action.meta.arg.id

        // Nếu updated isDefault → reset others
        if (updated.isDefault) {
          state.addresses.forEach((a) => (a.isDefault = false))
        }
        
        // Find by original ID (in case ID changed due to Copy-on-Write)
        const idx = state.addresses.findIndex((a) => a.id === originalId)

        if (idx !== -1) state.addresses[idx] = updated
      })

    // Delete
    builder
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a.id !== action.payload)
      })

    // Set Default
    builder
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        const updated = action.payload


        // Defensive: validate payload exists
        if (!updated || !updated.id) return
        
        state.addresses.forEach((a) => {
          a.isDefault = a.id === updated.id
        })
      })
  }
})

// ================== Exports ==================
export const { clearError } = shippingAddressSlice.actions

export const selectAddresses = (state: RootState) =>
  state.shippingAddressReducer.addresses
export const selectDefaultAddress = (state: RootState) =>
  state.shippingAddressReducer.addresses.find((a) => a.isDefault) || null
export const selectAddressLoading = (state: RootState) =>
  state.shippingAddressReducer.loading

export default shippingAddressSlice.reducer
