import { Product } from './product.type'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipping'
  | 'completed'
  | 'cancelled'

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: number
  userId: number
  status: OrderStatus
  totalAmount: number
  shippingAddressId: number
  paymentMethod: string
  note?: string
  shippingFee: number
  voucherCode?: string
  discountAmount: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  shippingAddressId: number
  paymentMethod: string
  voucherCode?: string
  note?: string
}

export interface OrderFilters {
  page?: number
  limit?: number
  status?: OrderStatus
}
