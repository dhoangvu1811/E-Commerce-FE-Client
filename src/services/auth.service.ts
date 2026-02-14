import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import { ApiResponse } from '@/types/api.type'
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  SendVerificationEmailRequest,
  VerifyAccountRequest,
  User
} from '@/types/auth.type'

export const authService = {
  login: async (data: LoginRequest) => {
    return await axiosInstance.post<ApiResponse<AuthResponse>>(
      API_ENDPOINTS.AUTH.LOGIN,
      data
    )
  },

  register: async (data: RegisterRequest) => {
    return await axiosInstance.post<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
  },

  logout: async () => {
    return await axiosInstance.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT
    )
  },

  refreshToken: async () => {
    return await axiosInstance.post<ApiResponse<void>>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN
    )
  },

  sendVerificationEmail: async (data: SendVerificationEmailRequest) => {
    return await axiosInstance.post<ApiResponse<{ email: string; expiresIn: string }>>(
      API_ENDPOINTS.AUTH.SEND_VERIFICATION_EMAIL,
      data
    )
  },

  verifyAccount: async (params: VerifyAccountRequest) => {
    return await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.VERIFY_ACCOUNT,
      { params }
    )
  }
}
