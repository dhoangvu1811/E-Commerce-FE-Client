import { axiosClient, API_ENDPOINTS } from '@/apis'
import type {
  ProductListResponse,
  ProductDetailResponse,
  ProductFilters,
  ProductCategoryResponse,
  CategoryDetailResponse,
  CategoryFilters
} from '@/types/product.type'

export const productService = {
  /**
   * Get all products with pagination and filters
   */
  getAll: async (params?: ProductFilters) => {
    const response = await axiosClient.get<ProductListResponse>(
      API_ENDPOINTS.PRODUCTS.ALL,
      {
        params
      }
    )

    return response.data
  },

  /**
   * Get all product categories with pagination and search
   */
  getAllCategories: async (params?: CategoryFilters) => {
    const response = await axiosClient.get<ProductCategoryResponse>(
      API_ENDPOINTS.CATEGORIES.ALL,
      {
        params
      }
    )

    return response.data
  },

  /**
   * Get category details by ID
   */
  getCategoryById: async (id: number | string) => {
    const response = await axiosClient.get<CategoryDetailResponse>(
      API_ENDPOINTS.CATEGORIES.DETAILS(id)
    )

    return response.data
  },

  /**
   * Get product details by ID
   */
  getById: async (id: number | string) => {
    const response = await axiosClient.get<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCTS.DETAILS(id)
    )

    return response.data
  }
}
