// API Endpoints Configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8017/V1'

export const API_ENDPOINTS = {
  // Product Management
  PRODUCTS: {
    ALL: '/products/getAll',
    DETAILS: (id: number | string) => `/products/details/${id}`
  },

  // Category Management
  CATEGORIES: {
    ALL: '/categories',
    DETAILS: (id: number | string) => `/categories/${id}`
  },

  // Auth & User Management
  AUTH: {
    REGISTER: '/users/register',
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    REFRESH_TOKEN: '/users/refresh-token',
    GOOGLE: '/users/auth/google',
    FACEBOOK: '/users/auth/facebook'
  },
  USER: {
    PROFILE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    MY_SESSIONS: '/users/my-sessions',
    REVOKE_SESSION: '/users/revoke-my-session'
  },
  ORDERS: {
    MY_ORDERS: '/orders/my-orders',
    DETAILS: '/orders/details/:id',
    CANCEL: '/orders/cancel/:id'
  }
} as const

export { BASE_URL }
