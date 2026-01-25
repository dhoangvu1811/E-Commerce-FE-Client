import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

type InitialState = {
  cartItems: CartItem[]
}

type CartItem = {
  id: number
  name: string
  price: number
  discountedPrice: number
  quantity: number
  image: string
}

const initialState: InitialState = {
  cartItems: []
}

export const cart = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, name, price, quantity, discountedPrice, image } =
        action.payload
      const existingItem = state.cartItems.find((item) => item.id === id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cartItems.push({
          id,
          name,
          price,
          quantity,
          discountedPrice,
          image
        })
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId)
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload
      const existingItem = state.cartItems.find((item) => item.id === id)

      if (existingItem) {
        existingItem.quantity = quantity
      }
    },

    removeAllItemsFromCart: (state) => {
      state.cartItems = []
    }
  }
})

export const selectCartItems = (state: RootState) => state.cartReducer.cartItems

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity
  }, 0)
})

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart
} = cart.actions
export default cart.reducer
