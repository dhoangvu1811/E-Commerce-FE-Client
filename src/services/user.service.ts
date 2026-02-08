import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import { ApiResponse } from '@/types/api.type'
import {
  ChangePasswordRequest,
  RevokeSessionRequest,
  SessionInfo,
  UpdateProfileRequest,
  User
} from '@/types/auth.type'

export const userService = {
  getProfile: async () => {
    return await axiosInstance.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE,
      { _skipRedirect: true } as any
    )
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    // If avatar is present, use FormData
    if (data.avatar) {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value as string | Blob)
        }
      })
      return await axiosInstance.put<ApiResponse<User>>(
        API_ENDPOINTS.USER.PROFILE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
    }

    return await axiosInstance.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.PROFILE,
      data
    )
  },

  changePassword: async (data: ChangePasswordRequest) => {
    return await axiosInstance.put<ApiResponse<void>>(
      API_ENDPOINTS.USER.CHANGE_PASSWORD,
      data
    )
  },

  getMySessions: async () => {
    return await axiosInstance.get<ApiResponse<SessionInfo[]>>(
      API_ENDPOINTS.USER.MY_SESSIONS
    )
  },

  revokeSession: async (data: RevokeSessionRequest) => {
    return await axiosInstance.post<ApiResponse<void>>(
      API_ENDPOINTS.USER.REVOKE_SESSION,
      data
    )
  }
}
