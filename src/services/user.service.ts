import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'
import type {
  ChangePasswordRequest,
  RevokeSessionRequest,
  SessionsResponse,
  UpdateProfileRequest,
  UploadAvatarResponse,
  User
} from '@/types/auth.type';
import {
  SessionInfo
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
    return await axiosInstance.get<ApiResponse<SessionsResponse>>(
      API_ENDPOINTS.USER.MY_SESSIONS
    )
  },

  revokeSession: async (data: RevokeSessionRequest) => {
    return await axiosInstance.post<ApiResponse<void>>(
      API_ENDPOINTS.USER.REVOKE_SESSION,
      data
    )
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData()

    formData.append('avatar', file)

    return await axiosInstance.post<ApiResponse<UploadAvatarResponse>>(
      API_ENDPOINTS.USER.UPLOAD_AVATAR,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }
}
