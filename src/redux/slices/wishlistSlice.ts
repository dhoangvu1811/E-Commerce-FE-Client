import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type InitialState = {
  wishlistItems: WishListItem[]
}

type WishListItem = {
  id: number
  name: string
  price: number
  discountedPrice: number
  quantity: number
  status?: string
  image: string
}

const initialState: InitialState = {
  wishlistItems: []
}

export const wishlist = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addItemToWishlist: (state, action: PayloadAction<WishListItem>) => {
      const { id, name, price, quantity, image, discountedPrice, status } =
        action.payload
      const existingItem = state.wishlistItems.find((item) => item.id === id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.wishlistItems.push({
          id,
          name,
          price,
          quantity,
          image,
          discountedPrice,
          status
        })
      }
    },
    removeItemFromWishlist: (state, action: PayloadAction<number>) => {
      const itemId = action.payload
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== itemId
      )
    },

    removeAllItemsFromWishlist: (state) => {
      state.wishlistItems = []
    }
  }
})

export const {
  addItemToWishlist,
  removeItemFromWishlist,
  removeAllItemsFromWishlist
} = wishlist.actions
export default wishlist.reducer
