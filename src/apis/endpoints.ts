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
    SEND_VERIFICATION_EMAIL: '/users/send-verification-email',
    VERIFY_ACCOUNT: '/users/verify-account',
    GOOGLE: '/users/auth/google',
    GOOGLE_CALLBACK: '/users/auth/google/callback',
    FACEBOOK: '/users/auth/facebook',
    FACEBOOK_CALLBACK: '/users/auth/facebook/callback'
  },
  USER: {
    PROFILE: '/users/me',
    CHANGE_PASSWORD: '/users/me/password',
    UPLOAD_AVATAR: '/users/upload-avatar',
    MY_SESSIONS: '/users/my-sessions',
    REVOKE_SESSION: '/users/revoke-my-session'
  },

  // Order Management
  ORDERS: {
    CREATE: '/orders/create',
    MY_ORDERS: '/orders/my-orders',
    DETAILS: (id: number | string) => `/orders/details/${id}`,
    CANCEL: (id: number | string) => `/orders/cancel/${id}`
  },

  // Shipping Address Management
  SHIPPING_ADDRESSES: {
    LIST: '/shipping-addresses',
    CREATE: '/shipping-addresses',
    DETAIL: (id: number) => `/shipping-addresses/${id}`,
    UPDATE: (id: number) => `/shipping-addresses/${id}`,
    DELETE: (id: number) => `/shipping-addresses/${id}`,
    SET_DEFAULT: (id: number) => `/shipping-addresses/${id}/default`
  }
} as const

export { BASE_URL }
