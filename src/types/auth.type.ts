export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  avatar?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  user: User
  accessToken?: string // usually http-only cookies, but if returns in body
  refreshToken?: string
  sessionId?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
  address?: string
}

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  avatar?: File
}

export interface RevokeSessionRequest {
  sessionId: string
}

export interface SessionInfo {
  sessionId: string
  deviceName?: string
  ipAddress?: string
  createdAt?: string
}
