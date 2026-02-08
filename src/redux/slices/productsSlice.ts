import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { productService } from '@/services'
import { Product, ProductFilters } from '@/types/product.type'

import { PaginationInfo } from '@/types/api.type'

interface ProductsState {
  products: Product[]
  loading: boolean
  error: string | null
  pagination: PaginationInfo
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  }
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductFilters, { rejectWithValue }) => {
    try {
      const response = await productService.getAll(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      )
    }
  }
)

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default productsSlice.reducer
