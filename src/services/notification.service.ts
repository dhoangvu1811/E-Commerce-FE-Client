/**
 * Notification Service
 * Gọi API notification từ Backend
 */

import axiosInstance from '@/apis/axiosInstance'
import { API_ENDPOINTS } from '@/apis/endpoints'
import type { ApiResponse } from '@/types/api.type'
import type { NotificationListResponse, NotificationFilters } from '@/types/notification.type'

export const notificationService = {
  /**
   * Lấy danh sách thông báo (paginated)
   */
  getMyNotifications: async (params?: NotificationFilters) => {
    return await axiosInstance.get<ApiResponse<NotificationListResponse>>(
      API_ENDPOINTS.NOTIFICATIONS.LIST,
      { params }
    )
  },

  /**
   * Đánh dấu 1 thông báo đã đọc
   */
  markAsRead: async (id: number) => {
    return await axiosInstance.patch<ApiResponse<null>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    )
  },

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  markAllAsRead: async () => {
    return await axiosInstance.patch<ApiResponse<null>>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    )
  },

  /**
   * Xoá 1 thông báo
   */
  deleteNotification: async (id: number) => {
    return await axiosInstance.delete<ApiResponse<null>>(
      API_ENDPOINTS.NOTIFICATIONS.DELETE(id)
    )
  },

  /**
   * Xoá tất cả thông báo đã đọc
   */
  deleteAllRead: async () => {
    return await axiosInstance.delete<ApiResponse<{ deletedCount: number }>>(
      API_ENDPOINTS.NOTIFICATIONS.DELETE_READ
    )
  }
}
