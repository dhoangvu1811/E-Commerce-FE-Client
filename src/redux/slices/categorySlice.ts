import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '@/services'
import { Category } from '@/types/product.type'

interface CategoryState {
  items: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoryState = {
  items: [],
  loading: false,
  error: null
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getAllCategories()
      return data.data
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
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default categorySlice.reducer
