import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '@/services'
import { Category } from '@/types/product.type'

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllCategories()
      return response.data.categories
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch categories'
      )
    }
  }
)

export const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default categorySlice.reducer
