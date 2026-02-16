// Shipping Address Types — khớp với BE ShippingAddress model

export interface ShippingAddressItem {
  id: number
  userId: number
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string | null
  isDefault: boolean
  isActive?: boolean
  createdAt: string
}

export interface CreateShippingAddressPayload {
  fullName: string
  phone: string
  address: string
  city: string
  province: string
  postalCode?: string
  isDefault?: boolean
}

export interface UpdateShippingAddressPayload {
  fullName?: string
  phone?: string
  address?: string
  city?: string
  province?: string
  postalCode?: string
  isDefault?: boolean
}
