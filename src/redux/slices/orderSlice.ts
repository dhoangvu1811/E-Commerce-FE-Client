import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { orderService } from '@/services/order.service'
import { Order, OrderFilters } from '@/types/order.type'
import { PaginationInfo } from '@/types/api.type'

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  loading: boolean
  error: string | null
  pagination: PaginationInfo
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
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
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (params: OrderFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      )
    }
  }
)

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchOrderDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderDetails(id)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order details'
      )
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await orderService.cancelOrder(id)
      return id
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order'
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload.data.orders
        state.pagination = action.payload.data.pagination
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
      .addCase(cancelOrder.fulfilled, (state, action) => {
        // Update status in list if exists
        const order = state.orders.find((o) => o.id === action.payload)
        if (order) {
          order.status = 'cancelled'
        }
        // Update current order if viewing details
        if (state.currentOrder && state.currentOrder.id === action.payload) {
          state.currentOrder.status = 'cancelled'
        }
      })
  }
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
