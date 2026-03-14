import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { reviewService } from '@/services/review.service'
import type {
  CreateReviewPayload,
  ReviewEligibility,
  ReviewItem,
  ReviewSummary
} from '@/types/review.type'

interface ReviewState {
  reviews: ReviewItem[]
  summary: ReviewSummary | null
  eligibility: ReviewEligibility | null
  loadingReviews: boolean
  loadingSummary: boolean
  loadingEligibility: boolean
  creating: boolean
  error: string | null
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  const message = (error as { response?: { data?: { message?: string } } })
    ?.response?.data?.message

  return message || fallback
}

const initialState: ReviewState = {
  reviews: [],
  summary: null,
  eligibility: null,
  loadingReviews: false,
  loadingSummary: false,
  loadingEligibility: false,
  creating: false,
  error: null
}

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.getByProductId(productId)

      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Không thể tải danh sách đánh giá')
      )
    }
  }
)

export const fetchReviewSummary = createAsyncThunk(
  'reviews/fetchReviewSummary',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.getSummaryByProductId(productId)

      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Không thể tải thống kê đánh giá')
      )
    }
  }
)

export const fetchMyReviewEligibility = createAsyncThunk(
  'reviews/fetchMyReviewEligibility',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await reviewService.getMyEligibility(productId)

      return response.data
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Không thể tải trạng thái đánh giá')
      )
    }
  }
)

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (payload: CreateReviewPayload, { rejectWithValue }) => {
    try {
      const response = await reviewService.create(payload)

      return response.data
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Không thể gửi đánh giá'))
    }
  }
)

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null
    },
    clearEligibility: (state) => {
      state.eligibility = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReviews.pending, (state) => {
        state.loadingReviews = true
        state.error = null
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loadingReviews = false
        state.reviews = action.payload
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loadingReviews = false
        state.error = action.payload as string
      })

      .addCase(fetchReviewSummary.pending, (state) => {
        state.loadingSummary = true
      })
      .addCase(fetchReviewSummary.fulfilled, (state, action) => {
        state.loadingSummary = false
        state.summary = action.payload
      })
      .addCase(fetchReviewSummary.rejected, (state, action) => {
        state.loadingSummary = false
        state.error = action.payload as string
      })

      .addCase(fetchMyReviewEligibility.pending, (state) => {
        state.loadingEligibility = true
      })
      .addCase(fetchMyReviewEligibility.fulfilled, (state, action) => {
        state.loadingEligibility = false
        state.eligibility = action.payload
      })
      .addCase(fetchMyReviewEligibility.rejected, (state, action) => {
        state.loadingEligibility = false
        state.error = action.payload as string
      })

      .addCase(createReview.pending, (state) => {
        state.creating = true
        state.error = null
      })
      .addCase(createReview.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createReview.rejected, (state, action) => {
        state.creating = false
        state.error = action.payload as string
      })
  }
})

export const { clearReviewError, clearEligibility } = reviewSlice.actions
export default reviewSlice.reducer
