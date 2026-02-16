import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import { productService } from '@/services'
import type { Category, CategoryFilters } from '@/types/product.type'
import type { PaginationInfo } from '@/types/api.type'

interface CategoryState {
  categories: Category[]
  selectedCategory: Category | null
  pagination: PaginationInfo
  loading: boolean
  loadingDetail: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  pagination: {
    page: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: false,
  loadingDetail: false,
  error: null
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: CategoryFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await productService.getAllCategories(params)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)

export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id: number | string, { rejectWithValue }) => {
    try {
      const response = await productService.getCategoryById(id)

      
return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch category'
      )
    }
  }
)

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null
    }
  },
  extraReducers: (builder) => {
    builder

      // Fetch all categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload.categories
        state.pagination = action.payload.pagination
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Fetch category by ID
      .addCase(fetchCategoryById.pending, (state) => {
        state.loadingDetail = true
        state.error = null
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loadingDetail = false
        state.selectedCategory = action.payload
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loadingDetail = false
        state.error = action.payload as string
      })
  }
})

export const { clearSelectedCategory } = categorySlice.actions

export default categorySlice.reducer
