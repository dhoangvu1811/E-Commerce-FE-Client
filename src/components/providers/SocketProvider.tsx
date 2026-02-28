'use client'

/**
 * Socket.IO Provider cho Client
 * - Tự động kết nối khi user đã đăng nhập
 * - Tự động ngắt kết khi logout
 * - Refresh access token trước khi connect và khi token expired
 * - Cung cấp socket instance qua React Context
 * - Lắng nghe order events và hiển thị toast notification
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode
} from 'react'

import axios from 'axios'
import { io, type Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

import { useAppSelector, useAppDispatch } from '@/redux/store'
import { fetchMyOrders } from '@/redux/slices/orderSlice'
import { addRealtimeNotification, clearNotifications } from '@/redux/slices/notificationSlice'
import type {
  OrderStatusUpdatedPayload,
  OrderPaymentUpdatedPayload,
  OrderCancelledPayload,
  OrderMarkPaidPayload,
  NotificationNewPayload
} from '@/types/socket.type'
import { SOCKET_EVENTS } from '@/types/socket.type'

// ── URLs ──────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8017/V1'
const SOCKET_URL = API_BASE_URL.replace('/V1', '')

// ── Context ───────────────────────────────────
interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false
})

export const useSocket = () => useContext(SocketContext)

/**
 * Gọi refresh-token API để lấy access token mới
 * Trả về access token string nếu thành công, null nếu thất bại
 */
const fetchFreshAccessToken = async (): Promise<string | null> => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/users/refresh-token`,
      {},
      { withCredentials: true }
    )

    return res.data?.data?.accessToken || null
  } catch {
    return null
  }
}

// ── Provider ──────────────────────────────────
export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3
  const dispatch = useAppDispatch()
  const [isConnected, setIsConnected] = useState(false)

  const { isAuthenticated } = useAppSelector((state) => state.authReducer)

  /**
   * Xử lý khi nhận event cập nhật trạng thái đơn hàng
   * Không hiển thị toast ở đây — toast được xử lý tập trung bởi NOTIFICATION_NEW handler
   */
  const handleOrderStatusUpdated = useCallback(
    (_data: OrderStatusUpdatedPayload) => {
      // Refresh danh sách đơn hàng
      dispatch(fetchMyOrders({ page: 1 }))
    },
    [dispatch]
  )

  /**
   * Xử lý khi nhận event cập nhật thanh toán
   * Không hiển thị toast ở đây — toast được xử lý tập trung bởi NOTIFICATION_NEW handler
   */
  const handlePaymentUpdated = useCallback(
    (_data: OrderPaymentUpdatedPayload) => {
      dispatch(fetchMyOrders({ page: 1 }))
    },
    [dispatch]
  )

  /**
   * Xử lý khi đơn hàng bị hủy (bởi admin)
   * Không hiển thị toast ở đây — toast được xử lý tập trung bởi NOTIFICATION_NEW handler
   */
  const handleOrderCancelled = useCallback(
    (_data: OrderCancelledPayload) => {
      dispatch(fetchMyOrders({ page: 1 }))
    },
    [dispatch]
  )

  /**
   * Xử lý khi xác nhận thanh toán thành công
   * Không hiển thị toast ở đây — toast được xử lý tập trung bởi NOTIFICATION_NEW handler
   */
  const handleMarkPaid = useCallback(
    (_data: OrderMarkPaidPayload) => {
      dispatch(fetchMyOrders({ page: 1 }))
    },
    [dispatch]
  )

  /**
   * Xử lý khi nhận notification mới (từ DB)
   */
  const handleNewNotification = useCallback(
    (data: NotificationNewPayload) => {
      toast(data.message, {
        icon: '🔔',
        duration: 4000
      })

      // Thêm notification mới vào Redux store (realtime)
      dispatch(
        addRealtimeNotification({
          id: data.id,
          userId: 0,
          type: data.type,
          message: data.message,
          isRead: false,
          createdAt: data.createdAt,
          updatedAt: data.createdAt
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    // Chỉ kết nối khi đã đăng nhập
    if (!isAuthenticated) {
      // Ngắt kết nối nếu đang có
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      retryCountRef.current = 0
      setIsConnected(false)

      // Xoá notification state khi logout
      dispatch(clearNotifications())

      return
    }

    // Tránh kết nối lại nếu đã có
    if (socketRef.current?.connected) return

    /**
     * Refresh token trước → kết nối socket → nếu TOKEN_EXPIRED thì refresh và retry
     */
    const connectSocket = async () => {
      // Lấy access token mới qua refresh endpoint
      const freshToken = await fetchFreshAccessToken()

      // Nếu đã bị disconnect trong lúc chờ refresh, bỏ qua
      if (socketRef.current?.connected) return

      // Nếu không lấy được token → không kết nối
      if (!freshToken) {
        // eslint-disable-next-line no-console
        console.warn('[Socket] Không lấy được access token, bỏ qua kết nối')

        return
      }

      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        autoConnect: true,

        // Truyền token trực tiếp qua auth (không phụ thuộc cookie trong WS handshake)
        auth: { token: freshToken },

        // Tắt auto reconnect mặc định, tự xử lý retry với refresh token
        reconnection: false
      })

      // ── Lắng nghe sự kiện ──
      socket.on('connect', () => {
        retryCountRef.current = 0
        setIsConnected(true)
        // eslint-disable-next-line no-console
        console.log('[Socket] Connected:', socket.id)
      })

      socket.on('disconnect', (reason) => {
        setIsConnected(false)
        // eslint-disable-next-line no-console
        console.log('[Socket] Disconnected:', reason)

        // Nếu server ngắt (không phải do client disconnect), thử reconnect
        if (reason === 'io server disconnect' || reason === 'transport close') {
          setTimeout(() => {
            if (retryCountRef.current < maxRetries) {
              retryCountRef.current++
              // eslint-disable-next-line no-console
              console.log(`[Socket] Reconnecting... (${retryCountRef.current}/${maxRetries})`)
              connectSocket()
            }
          }, 2000)
        }
      })

      socket.on('connect_error', async (err) => {
        // eslint-disable-next-line no-console
        console.error('[Socket] Connection error:', err.message)

        // Token hết hạn → refresh rồi thử lại
        if (err.message === 'TOKEN_EXPIRED' && retryCountRef.current < maxRetries) {
          retryCountRef.current++
          // eslint-disable-next-line no-console
          console.log(`[Socket] Token expired, refreshing... (${retryCountRef.current}/${maxRetries})`)

          socket.disconnect()
          socketRef.current = null

          // Retry sẽ gọi lại connectSocket → fetchFreshAccessToken → auth.token mới
          setTimeout(() => connectSocket(), 500)
        }
      })

      // ── Order lifecycle events ──
      socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatusUpdated)
      socket.on(SOCKET_EVENTS.ORDER_PAYMENT_UPDATED, handlePaymentUpdated)
      socket.on(SOCKET_EVENTS.ORDER_CANCELLED, handleOrderCancelled)
      socket.on(SOCKET_EVENTS.ORDER_MARK_PAID, handleMarkPaid)
      socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, handleNewNotification)

      socketRef.current = socket
    }

    connectSocket()

    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [
    isAuthenticated,
    dispatch,
    handleOrderStatusUpdated,
    handlePaymentUpdated,
    handleOrderCancelled,
    handleMarkPaid,
    handleNewNotification
  ])

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}
