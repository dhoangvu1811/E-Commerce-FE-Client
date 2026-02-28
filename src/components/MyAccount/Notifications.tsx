'use client'

/**
 * Notifications Component
 * Hiển thị danh sách thông báo trong trang My Account
 * Hỗ trợ: phân trang, đánh dấu đã đọc, đánh dấu tất cả đã đọc
 */

import React, { useEffect, useCallback, useState } from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications
} from '@/redux/slices/notificationSlice'

/**
 * Format thời gian tương đối (vd: "5 phút trước", "2 ngày trước")
 */
const timeAgo = (dateStr: string): string => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 30) return `${diffDay} ngày trước`

  return date.toLocaleDateString('vi-VN')
}

/**
 * Icon theo loại thông báo
 */
const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'ORDER_STATUS':
      return '📦'
    case 'ORDER_PAYMENT':
      return '💳'
    case 'ORDER_CANCELLED':
      return '❌'
    case 'ORDER_NEW':
      return '🛒'
    default:
      return '🔔'
  }
}

const Notifications = () => {
  const dispatch = useAppDispatch()

  const { notifications, unreadCount, loading, pagination } = useAppSelector(
    (state) => state.notificationReducer
  )

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [showDeleteAllReadDialog, setShowDeleteAllReadDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }))
  }, [dispatch])

  const handleMarkAsRead = useCallback(
    (id: number) => {
      dispatch(markNotificationAsRead(id))
    },
    [dispatch]
  )

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead())
  }, [dispatch])

  const handleDelete = useCallback(
    (id: number) => {
      dispatch(deleteNotification(id))
      setDeleteConfirmId(null)
    },
    [dispatch]
  )

  const handleDeleteAllRead = useCallback(() => {
    dispatch(deleteAllReadNotifications()).then(() => {
      dispatch(fetchNotifications({ page: 1, limit: 20 }))
    })
    setShowDeleteAllReadDialog(false)
  }, [dispatch])

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(fetchNotifications({ page, limit: 20 }))
    },
    [dispatch]
  )

  return (
    <div className='py-6 px-4 sm:px-7.5 xl:px-10'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h4 className='font-medium text-lg text-dark'>Thông báo</h4>
          {unreadCount > 0 && (
            <p className='text-custom-sm text-gray-5 mt-1'>
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className='text-custom-sm text-blue hover:underline ease-out duration-200'
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}

        {notifications.some((n) => n.isRead) && (
          <button
            onClick={() => setShowDeleteAllReadDialog(true)}
            className='text-custom-sm text-red hover:underline ease-out duration-200'
          >
            Xoá đã đọc
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className='flex justify-center py-10'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue'></div>
        </div>
      )}

      {/* Empty */}
      {!loading && notifications.length === 0 && (
        <div className='text-center py-10'>
          <span className='text-4xl mb-3 block'>🔔</span>
          <p className='text-gray-5'>Bạn chưa có thông báo nào</p>
        </div>
      )}

      {/* Notification list */}
      {!loading && notifications.length > 0 && (
        <div className='space-y-2'>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-4 rounded-lg border ease-out duration-200 cursor-pointer hover:bg-gray-1 ${
                notification.isRead
                  ? 'border-gray-3 bg-white'
                  : 'border-blue/20 bg-blue/5'
              }`}
              onClick={() => {
                if (!notification.isRead) {
                  handleMarkAsRead(notification.id)
                }
              }}
            >
              {/* Icon */}
              <span className='text-xl flex-shrink-0 mt-0.5'>
                {getNotificationIcon(notification.type)}
              </span>

              {/* Content */}
              <div className='flex-1 min-w-0'>
                <p
                  className={`text-custom-sm leading-relaxed ${
                    notification.isRead ? 'text-gray-5' : 'text-dark font-medium'
                  }`}
                >
                  {notification.message}
                </p>
                <p className='text-xs text-gray-4 mt-1'>
                  {timeAgo(notification.createdAt)}
                </p>
              </div>

              {/* Unread dot + Delete */}
              <div className='flex items-center gap-1 flex-shrink-0 mt-0.5'>
                {!notification.isRead && (
                  <span className='w-2.5 h-2.5 rounded-full bg-blue flex-shrink-0'></span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setDeleteConfirmId(notification.id)
                  }}
                  className='p-1 rounded-full opacity-40 hover:opacity-100 hover:bg-red/10 hover:text-red ease-out duration-200'
                  title='Xoá thông báo'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className='flex items-center justify-center gap-2 mt-6'>
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={!pagination.hasPrevPage}
            className='px-3 py-1.5 text-custom-sm rounded border border-gray-3 ease-out duration-200 hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Trước
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Hiển thị tối đa 5 trang gần page hiện tại
              return Math.abs(p - pagination.page) <= 2
            })
            .map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1.5 text-custom-sm rounded border ease-out duration-200 ${
                  p === pagination.page
                    ? 'bg-blue text-white border-blue'
                    : 'border-gray-3 hover:bg-gray-1'
                }`}
              >
                {p}
              </button>
            ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={!pagination.hasNextPage}
            className='px-3 py-1.5 text-custom-sm rounded border border-gray-3 ease-out duration-200 hover:bg-gray-1 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Sau
          </button>
        </div>
      )}

      {/* Dialog xác nhận xoá 1 thông báo */}
      {deleteConfirmId !== null && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
            <h5 className='font-medium text-dark mb-2'>Xác nhận xoá</h5>
            <p className='text-custom-sm text-gray-5 mb-5'>
              Bạn có chắc muốn xoá thông báo này? Hành động không thể hoàn tác.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className='px-4 py-2 text-custom-sm rounded border border-gray-3 hover:bg-gray-1 ease-out duration-200'
              >
                Huỷ
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className='px-4 py-2 text-custom-sm rounded bg-red text-white hover:bg-red/90 ease-out duration-200'
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog xác nhận xoá tất cả đã đọc */}
      {showDeleteAllReadDialog && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl'>
            <h5 className='font-medium text-dark mb-2'>
              Xoá thông báo đã đọc
            </h5>
            <p className='text-custom-sm text-gray-5 mb-5'>
              Bạn có chắc muốn xoá tất cả thông báo đã đọc? Hành động không thể
              hoàn tác.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowDeleteAllReadDialog(false)}
                className='px-4 py-2 text-custom-sm rounded border border-gray-3 hover:bg-gray-1 ease-out duration-200'
              >
                Huỷ
              </button>
              <button
                onClick={handleDeleteAllRead}
                className='px-4 py-2 text-custom-sm rounded bg-red text-white hover:bg-red/90 ease-out duration-200'
              >
                Xoá tất cả đã đọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications
