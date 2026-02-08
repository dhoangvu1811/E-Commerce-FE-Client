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
  categoryId?: number | string
  sort?:
    | 'price_asc'
    | 'price_desc'
    | 'name_asc'
    | 'name_desc'
    | 'newest'
    | 'oldest'
    | 'rating'
}

export interface CategoryFilters extends SearchParams {
  // Filters specific to categories
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
  data: {
    categories: Category[]
    pagination: PaginationInfo
  }
}

export interface CategoryDetailResponse {
  code: number
  message: string
  data: Category
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
