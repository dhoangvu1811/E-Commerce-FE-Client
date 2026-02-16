import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { productService } from '@/services'
import type { Product, ProductFilters } from '@/types/product.type'

import type { PaginationInfo } from '@/types/api.type'

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
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
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
