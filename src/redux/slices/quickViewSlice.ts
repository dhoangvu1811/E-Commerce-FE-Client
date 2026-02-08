import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from '@/types/product.type'

type InitialState = {
  value: Product
}

const initialState = {
  value: {
    id: 0,
    name: '',
    slug: '',
    image: '',
    images: [],
    description: '',
    price: 0,
    stock: 0,
    rating: 0,
    selled: 0,
    discount: 0,
    categoryId: 0,
    status: 'active',
    createdAt: '',
    updatedAt: ''
  } as Product
} as InitialState

export const quickView = createSlice({
  name: 'quickView',
  initialState,
  reducers: {
    updateQuickView: (_, action) => {
      return {
        value: {
          ...action.payload
        }
      }
    },

    resetQuickView: () => {
      return {
        value: initialState.value
      }
    }
  }
})

export const { updateQuickView, resetQuickView } = quickView.actions
export default quickView.reducer
