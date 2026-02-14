export interface User {
  id: number
  name: string
  email: string
  phoneNumber?: string | null
  address?: string | null
  avatar?: string | null
  dateOfBirth?: string | null
  gender?: 'male' | 'female' | 'other' | null
  emailVerified: boolean
  typeAccount: 'LOCAL' | 'GOOGLE' | 'FACEBOOK'
  status: 'active' | 'inactive' | 'banned'
  roleId: number
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
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
  confirmPassword: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
}

export interface ChangePasswordRequest {
  currentPassword?: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateProfileRequest {
  name?: string
  phoneNumber?: string
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
  deviceInfo: string
  ipAddress: string
  createdAt: string
  expiresAt: string
  isActive: boolean
  isCurrent: boolean
}

export interface SessionsResponse {
  sessions: SessionInfo[]
  total: number
}

export interface SendVerificationEmailRequest {
  email: string
}

export interface VerifyAccountRequest {
  email: string
  token: string
}

export interface UploadAvatarResponse {
  avatarUrl: string
  publicId: string
}
