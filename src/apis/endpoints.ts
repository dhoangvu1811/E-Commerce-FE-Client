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
  ORDERS: {
    MY_ORDERS: '/orders/my-orders',
    DETAILS: '/orders/details/:id',
    CANCEL: '/orders/cancel/:id'
  }
} as const

export { BASE_URL }
