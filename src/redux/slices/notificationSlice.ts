/**
 * Notification Redux Slice cho Client
 * Quản lý state thông báo: danh sách, unread count, loading, pagination
 */

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

import { notificationService } from '@/services/notification.service'
import type {
  Notification,
  NotificationFilters
} from '@/types/notification.type'
import type { PaginationInfo } from '@/types/api.type'

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  pagination: PaginationInfo
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    itemsPerPage: 20,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  }
}

// ── Async Thunks ──────────────────────────────

/**
 * Lấy danh sách thông báo
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (params: NotificationFilters | undefined, { rejectWithValue }) => {
    try {
      const response = await notificationService.getMyNotifications(params)

      return response.data.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }

      return rejectWithValue(
        err.response?.data?.message || 'Không thể tải thông báo'
      )
    }
  }
)

/**
 * Đánh dấu 1 thông báo đã đọc
 */
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id)

      return id
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }

      return rejectWithValue(
        err.response?.data?.message || 'Không thể đánh dấu đã đọc'
      )
    }
  }
)

/**
 * Đánh dấu tất cả thông báo đã đọc
 */
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }

      return rejectWithValue(
        err.response?.data?.message || 'Không thể đánh dấu tất cả đã đọc'
      )
    }
  }
)

/**
 * Xoá 1 thông báo
 */
export const deleteNotification = createAsyncThunk(
  'notifications/deleteOne',
  async (id: number, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(id)

      return id
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }

      return rejectWithValue(
        err.response?.data?.message || 'Không thể xoá thông báo'
      )
    }
  }
)

/**
 * Xoá tất cả thông báo đã đọc
 */
export const deleteAllReadNotifications = createAsyncThunk(
  'notifications/deleteAllRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.deleteAllRead()

      return response.data.data
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }

      return rejectWithValue(
        err.response?.data?.message || 'Không thể xoá thông báo đã đọc'
      )
    }
  }
)

// ── Slice ─────────────────────────────────────
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Thêm notification mới từ socket realtime
     * Chèn vào đầu danh sách + tăng unreadCount
     */
    addRealtimeNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
      state.unreadCount += 1
      state.pagination.totalItems += 1
    },

    /**
     * Reset state khi logout
     */
    clearNotifications: () => initialState
  },
  extraReducers: (builder) => {
    builder

      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload?.notifications || []
        state.unreadCount = action.payload?.unreadCount ?? 0
        state.pagination = action.payload?.pagination || state.pagination
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const id = action.payload
        const notification = state.notifications.find((n) => n.id === id)

        if (notification && !notification.isRead) {
          notification.isRead = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.isRead = true
        })
        state.unreadCount = 0
      })

      // Delete one notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload
        const notification = state.notifications.find((n) => n.id === id)

        if (notification && !notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }

        state.notifications = state.notifications.filter((n) => n.id !== id)
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems - 1
        )
      })

      // Delete all read notifications
      .addCase(deleteAllReadNotifications.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter((n) => !n.isRead)
        state.pagination.totalItems = Math.max(
          0,
          state.pagination.totalItems -
            (action.payload?.deletedCount || 0)
        )
      })
  }
})

export const { addRealtimeNotification, clearNotifications } =
  notificationSlice.actions
export default notificationSlice.reducer
