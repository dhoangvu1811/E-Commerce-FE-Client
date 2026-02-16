export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED'

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'CANCELLED'

export type PaymentMethod =
  | 'COD'
  | 'BANK_TRANSFER'
  | 'MOMO'
  | 'VNPAY'
  | 'ZALOPAY'

export type VoucherType = 'PERCENTAGE' | 'FIXED'

export interface OrderItem {
  productId: string
  name: string
  image: string
  unitPrice: number
  discount: number
  quantity: number
  lineTotal: number
}

export interface ShippingAddress {
  id?: string | number
  name: string
  phone: string
  address: string
  city: string
  province: string
  postalCode?: string
  isDefault?: boolean
}

export interface OrderVoucher {
  voucherId?: string | number
  code: string
  type: VoucherType
  amount: number
  maxDiscount?: number
  discountApplied: number
}

export interface OrderTotals {
  subtotal: number
  discount: number
  shippingFee: number
  payable: number
}

export interface LogEntry {
  id?: number
  action: string
  performedById?: number | null
  performedByRole?: 'user' | 'admin' | 'system' | null
  at: string // Backend uses Date, but Client often gets string from API JSON. Keeping string for safety in Client.
  note?: string | null
  fromStatus?: OrderStatus | null
  toStatus?: OrderStatus | null
  fromPaymentStatus?: PaymentStatus | null
  toPaymentStatus?: PaymentStatus | null
  meta?: any
}

export interface Payment {
  id: number
  orderId: number
  paymentMethod: PaymentMethod
  transactionId?: string | null
  value: number
  status: PaymentStatus
  paidAt?: string | null
  createdAt: string
}

export interface Order {
  id: number
  _id?: string | number
  userId: number
  orderCode: string
  
  items: OrderItem[]
  shippingAddress: ShippingAddress
  vouchers?: OrderVoucher[]
  totals: OrderTotals
  
  status: OrderStatus
  paymentStatus?: PaymentStatus
  payments: Payment[]
  logs: LogEntry[]
  
  deliveredAt: string | null
  createdAt: string
  updatedAt: string
}

// Create order payload (request body)
export interface CreateOrderPayload {
  items: Array<{
    productId: string | number
    quantity: number
  }>
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    province: string
    postalCode?: string
  }
  voucherCode?: string
  shippingFee?: number
  paymentMethod?: PaymentMethod
}

// Create order response (simplified)
export interface CreateOrderResponse {
  orderCode: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totals: OrderTotals
  createdAt: string
}

// Filters
export interface OrderFilters {
  page?: number
  itemsPerPage?: number
  status?: OrderStatus
}

// Status display helpers
export const ORDER_STATUS_NAMES: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy'
}

export const PAYMENT_STATUS_NAMES: Record<PaymentStatus, string> = {
  PENDING: 'Chưa thanh toán',
  PROCESSING: 'Đang xử lý',
  PAID: 'Đã thanh toán',
  FAILED: 'Thất bại',
  REFUNDED: 'Đã hoàn tiền',
  CANCELLED: 'Đã hủy'
}

export const PAYMENT_METHOD_NAMES: Record<PaymentMethod, string> = {
  COD: 'Thanh toán khi nhận hàng',
  BANK_TRANSFER: 'Chuyển khoản ngân hàng',
  MOMO: 'Ví MoMo',
  VNPAY: 'VNPay',
  ZALOPAY: 'ZaloPay'
}
