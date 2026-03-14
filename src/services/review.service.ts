import { axiosClient, API_ENDPOINTS } from '@/apis'
import type {
  CreateReviewPayload,
  ReviewApiResponse,
  ReviewEligibility,
  ReviewItem,
  ReviewSummary
} from '@/types/review.type'

export const reviewService = {
  getByProductId: async (productId: number | string) => {
    const response = await axiosClient.get<ReviewApiResponse<ReviewItem[]>>(
      API_ENDPOINTS.REVIEWS.BY_PRODUCT(productId)
    )

    return response.data
  },

  getSummaryByProductId: async (productId: number | string) => {
    const response = await axiosClient.get<ReviewApiResponse<ReviewSummary>>(
      API_ENDPOINTS.REVIEWS.SUMMARY(productId)
    )

    return response.data
  },

  getMyEligibility: async (productId: number | string) => {
    const response = await axiosClient.get<ReviewApiResponse<ReviewEligibility>>(
      API_ENDPOINTS.REVIEWS.MY_ELIGIBILITY(productId)
    )

    return response.data
  },

  create: async (payload: CreateReviewPayload) => {
    const response = await axiosClient.post<ReviewApiResponse<ReviewItem>>(
      API_ENDPOINTS.REVIEWS.CREATE,
      payload
    )

    return response.data
  }
}
