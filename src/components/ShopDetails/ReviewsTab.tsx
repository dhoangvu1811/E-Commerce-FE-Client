'use client'

import { useEffect, useMemo, useState } from 'react'

import Image from 'next/image'

import toast from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
  clearEligibility,
  createReview,
  fetchMyReviewEligibility,
  fetchProductReviews,
  fetchReviewSummary
} from '@/redux/slices/reviewSlice'

interface ReviewsTabProps {
  productId: number
  isAuthenticated: boolean
  onRequireAuth: () => void
  onReviewCreated?: (averageRating: number) => void
}

const renderStars = (rating: number) => {
  return [1, 2, 3, 4, 5].map(star => {
    const active = star <= rating

    return (
      <span key={star} className={active ? 'text-[#FBB040]' : 'text-gray-5'}>
        <svg
          className='fill-current'
          width='15'
          height='16'
          viewBox='0 0 15 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z' />
        </svg>
      </span>
    )
  })
}

const ReviewsTab = ({
  productId,
  isAuthenticated,
  onRequireAuth,
  onReviewCreated
}: ReviewsTabProps) => {
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { reviews, summary, eligibility, loadingReviews, loadingEligibility, creating } = useAppSelector(
    state => state.reviewReducer
  )

  useEffect(() => {
    dispatch(fetchProductReviews(productId))
    dispatch(fetchReviewSummary(productId))
  }, [dispatch, productId])

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearEligibility())

      return
    }

    dispatch(fetchMyReviewEligibility(productId))
  }, [dispatch, isAuthenticated, productId])

  const canSubmitReview = useMemo(() => {
    if (!isAuthenticated || loadingEligibility || !eligibility) {
      return false
    }

    return eligibility.canReview
  }, [eligibility, isAuthenticated, loadingEligibility])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isAuthenticated) {
      onRequireAuth()

      return
    }

    if (!canSubmitReview) {
      return
    }

    if (rating < 1 || rating > 5) {
      toast.error('Vui lòng chọn số sao từ 1 đến 5')

      return
    }

    try {
      await dispatch(
        createReview({
          productId,
          rating,
          comment: comment.trim() || undefined
        })
      ).unwrap()
    } catch (error) {
      toast.error((error as string) || 'Không thể gửi đánh giá')

      return
    }

    setRating(0)
    setComment('')
    toast.success('Đánh giá sản phẩm thành công')
    dispatch(fetchProductReviews(productId))

    const latestSummary = await dispatch(fetchReviewSummary(productId)).unwrap()

    dispatch(fetchMyReviewEligibility(productId))

    onReviewCreated?.(latestSummary.averageRating)
  }

  return (
    <div className='flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 flex'>
      <div className='max-w-[570px] w-full'>
        <h2 className='font-medium text-2xl text-dark mb-4'>{summary?.totalReviews || 0} đánh giá cho sản phẩm này</h2>

        <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6 mb-6'>
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <p className='text-lg font-medium text-dark'>{summary?.averageRating?.toFixed(1) || '0.0'} / 5</p>
            <div className='flex items-center gap-1'>{renderStars(Math.round(summary?.averageRating || 0))}</div>
          </div>

          <div className='mt-4 space-y-2 text-sm text-dark-4'>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className='flex items-center justify-between'>
                <span>{star} sao</span>
                <span>{summary?.ratingBreakdown?.[star as 1 | 2 | 3 | 4 | 5] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {loadingReviews ? (
          <p>Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className='text-dark-4'>Sản phẩm chưa có đánh giá nào.</p>
        ) : (
          <div className='flex flex-col gap-6'>
            {reviews.map(review => (
              <div key={review.id} className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
                <div className='flex items-center justify-between gap-4 flex-wrap'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12.5 h-12.5 rounded-full overflow-hidden bg-gray-2'>
                      <Image
                        src={review.user?.avatar || '/images/users/user-01.jpg'}
                        alt={review.user?.name || 'user avatar'}
                        width={50}
                        height={50}
                        className='w-12.5 h-12.5 object-cover'
                      />
                    </div>

                    <div>
                      <h3 className='font-medium text-dark'>{review.user?.name || 'Người dùng'}</h3>
                      <p className='text-custom-sm text-dark-4'>
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-1'>{renderStars(review.rating)}</div>
                </div>

                <p className='text-dark mt-4'>{review.comment || 'Không có bình luận.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='max-w-[550px] w-full'>
        <form onSubmit={handleSubmit}>
          <h2 className='font-medium text-2xl text-dark mb-3.5'>Gửi đánh giá</h2>

          {!isAuthenticated ? (
            <p className='mb-6 text-dark-4'>Bạn cần đăng nhập để đánh giá sản phẩm.</p>
          ) : loadingEligibility ? (
            <p className='mb-6 text-dark-4'>Đang kiểm tra điều kiện đánh giá...</p>
          ) : !eligibility?.canReview ? (
            <p className='mb-6 text-dark-4'>{eligibility?.reason || 'Bạn chưa thể đánh giá sản phẩm này.'}</p>
          ) : (
            <p className='mb-6 text-dark-4'>Đánh giá của bạn sẽ giúp người mua khác chọn sản phẩm tốt hơn.</p>
          )}

          <div className='flex items-center gap-3 mb-7.5'>
            <span>Đánh giá sao*</span>

            <div className='flex items-center gap-1'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setRating(star)}
                  className={star <= rating ? 'text-[#FBB040]' : 'text-gray-5'}
                  aria-label={`Chọn ${star} sao`}
                  disabled={!canSubmitReview || creating}
                >
                  <svg
                    className='fill-current'
                    width='15'
                    height='16'
                    viewBox='0 0 15 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M14.6604 5.90785L9.97461 5.18335L7.85178 0.732874C7.69645 0.422375 7.28224 0.422375 7.12691 0.732874L5.00407 5.20923L0.344191 5.90785C0.0076444 5.9596 -0.121797 6.39947 0.137085 6.63235L3.52844 10.1255L2.72591 15.0158C2.67413 15.3522 3.01068 15.6368 3.32134 15.4298L7.54112 13.1269L11.735 15.4298C12.0198 15.5851 12.3822 15.3263 12.3046 15.0158L11.502 10.1255L14.8934 6.63235C15.1005 6.39947 14.9969 5.9596 14.6604 5.90785Z' />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className='rounded-xl bg-white shadow-1 p-4 sm:p-6'>
            <div className='mb-5'>
              <label htmlFor='review-comment' className='block mb-2.5'>
                Bình luận
              </label>

              <textarea
                id='review-comment'
                rows={5}
                maxLength={500}
                placeholder='Chia sẻ trải nghiệm của bạn với sản phẩm'
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={!canSubmitReview || creating}
              />

              <span className='flex items-center justify-between mt-2.5'>
                <span className='text-custom-sm text-dark-4'>Tối đa</span>
                <span className='text-custom-sm text-dark-4'>{comment.length}/500</span>
              </span>
            </div>

            <button
              type='submit'
              className='inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={!canSubmitReview || creating}
            >
              {creating ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>

            {!isAuthenticated && (
              <button
                type='button'
                className='inline-flex font-medium text-blue py-3 px-4 ml-2'
                onClick={onRequireAuth}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewsTab
