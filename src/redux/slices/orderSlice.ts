import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { orderService } from '@/services/order.service'
import type {
  Order,
  OrderFilters,
  CreateOrderPayload,
  CreateOrderResponse
} from '@/types/order.type'
import type { PaginationInfo } from '@/types/api.type'

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  lastCreatedOrder: CreateOrderResponse | null
  loading: boolean
  creating: boolean
  cancelling: boolean
  error: string | null
  pagination: PaginationInfo
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  lastCreatedOrder: null,
  loading: false,
  creating: false,
  cancelling: false,
  error: null,
  pagination: {
    page: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
}

// Thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(payload)

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tạo đơn hàng'
      )
    }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params: OrderFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(params)

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải danh sách đơn hàng'
      )
    }
  }
)

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderDetails(id)

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể tải chi tiết đơn hàng'
      )
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await orderService.cancelOrder(id)

      
return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Không thể hủy đơn hàng'
      )
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearLastCreatedOrder: (state) => {
      state.lastCreatedOrder = null
    },
    clearOrderError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder

      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false
        state.lastCreatedOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload as string
      })

      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false

        // Defensive: validate payload structure
        state.orders = Array.isArray(action.payload?.orders) ? action.payload.orders : []
        state.pagination = action.payload?.pagination || state.pagination
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.cancelling = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelling = false
        const cancelledOrder = action.payload


        // Update in list
        const index = state.orders.findIndex(
          (o) => o.id === cancelledOrder.id
        )

        if (index !== -1) {
          state.orders[index] = cancelledOrder
        }


        // Update current order if viewing
        if (state.currentOrder?.id === cancelledOrder.id) {
          state.currentOrder = cancelledOrder
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelling = false
        state.error = action.payload as string
      })
  }
})

export const { clearCurrentOrder, clearLastCreatedOrder, clearOrderError } =
  orderSlice.actions
export default orderSlice.reducer
