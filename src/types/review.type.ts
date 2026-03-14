export interface ReviewUser {
  id: number
  name: string
  avatar?: string | null
}

export interface ReviewItem {
  id: number
  userId: number
  productId: number
  rating: number
  comment?: string | null
  createdAt: string
  user?: ReviewUser
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingBreakdown: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export interface ReviewEligibility {
  canReview: boolean
  hasReviewed: boolean
  reason: string | null
  myReview: ReviewItem | null
}

export interface ReviewApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface CreateReviewPayload {
  productId: number
  rating: number
  comment?: string
}
