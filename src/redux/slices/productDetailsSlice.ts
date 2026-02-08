import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { productService } from '@/services'
import { Product } from '@/types/product.type'

interface ProductDetailsState {
  item: Product | null
  loading: boolean
  error: string | null
}

const initialState: ProductDetailsState = {
  item: null,
  loading: false,
  error: null
}

export const fetchProductDetails = createAsyncThunk(
  'productDetails/fetchProductDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      const data = await productService.getById(id)
      return data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product details'
      )
    }
  }
)

export const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.item = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false
        state.item = action.payload
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setProductDetails } = productDetailsSlice.actions
export default productDetailsSlice.reducer
