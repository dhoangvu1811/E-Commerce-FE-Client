import type { PaginationInfo, SearchParams } from './api.type'

// =========================================
// Product Entity Types
// =========================================

export interface ProductImage {
  id: number
  productId: number
  image: string
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string // Added from API doc
  description?: string
  _count?: {
    products: number
  }
  createdAt?: string
  updatedAt?: string
}

export type ProductStatus = 'active' | 'inactive'

export interface Product {
  id: number
  name: string
  slug: string
  image: string // Main thumbnail
  images: ProductImage[] // Gallery
  description?: string
  price: number | string
  stock: number
  rating: number | string
  reviews?: number
  selled: number
  discount: number | string
  categoryId: number
  category?: Category
  status: ProductStatus
  createdAt: string
  updatedAt: string
}

// =========================================
// API Payload Types
// =========================================

export interface ProductFilters extends SearchParams {
  categoryId?: string // Category name
  sort?:
    | 'price_asc'
    | 'price_desc'
    | 'rating_desc'
    | 'name_asc'
    | 'name_desc'
    | 'selled_desc'
    | 'createdAt_desc'
}

// =========================================
// API Response Types
// =========================================

export interface ProductListResponse {
  code: number
  message: string
  data: {
    products: Product[]
    pagination: PaginationInfo
  }
}

export interface ProductDetailResponse {
  code: number
  message: string
  data: Product
}

export interface ProductCategoryResponse {
  code: number
  message: string
  data: Category[]
}

// =========================================
// Redux State Type
// =========================================

export interface ProductState {
  products: Product[]
  productCategories: Category[]
  selectedProduct: Product | null
  pagination: PaginationInfo
  filters: ProductFilters
  isLoading: boolean
  isLoadingDetail: boolean
  error: string | null
}
