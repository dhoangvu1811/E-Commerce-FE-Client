// API Endpoints Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8017/V1'

export const API_ENDPOINTS = {
  // Product Management
  PRODUCTS: {
    ALL: '/products/getAll',
    GET_ALL_CATEGORIES: '/products/get-all-categories',
    DETAILS: (id: number | string) => `/products/details/${id}`
  },

  // Category Management
  CATEGORIES: {
    ALL: '/categories',
    DETAILS: (id: number | string) => `/categories/${id}`
  }
} as const

export { BASE_URL }
