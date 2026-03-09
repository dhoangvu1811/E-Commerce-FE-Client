'use client'
import React, { useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import Breadcrumb from '../Common/Breadcrumb'
import { useAppSelector, useAppDispatch } from '@/redux/store'
import {
  fetchWishlist,
  selectWishlistItems,
  selectWishlistLoading,
  selectWishlistError
} from '@/redux/slices/wishlistSlice'
import SingleItem from './SingleItem'
import PreLoader from '../Common/PreLoader'

export const Wishlist = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isAuthenticated, initialized } = useAppSelector((state) => state.authReducer)
  const wishlistItems = useAppSelector(selectWishlistItems)
  const loading = useAppSelector(selectWishlistLoading)
  const error = useAppSelector(selectWishlistError)

  useEffect(() => {
    // Chưa biết auth state thực sự (fetchProfile chưa xong) → chờ
    if (!initialized) return

    if (isAuthenticated) {
      dispatch(fetchWishlist())
    } else {
      router.push('/signin')
    }
  }, [dispatch, isAuthenticated, initialized, router])

  // Chờ fetchProfile xong trước khi quyết định render hay redirect
  if (!initialized) return <PreLoader />
  if (!isAuthenticated) return null
  if (loading) return <PreLoader />
  
  if (error) {
    return (
      <>
        <Breadcrumb title={'Wishlist'} pages={['Wishlist']} />
        <section className='overflow-hidden py-20 bg-gray-2'>
          <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
            <div className='bg-white rounded-[10px] shadow-1 py-20 flex flex-col items-center justify-center gap-4'>
              <p className='text-red text-lg font-medium'>{error}</p>
              <button
                onClick={() => dispatch(fetchWishlist())}
                className='bg-blue text-white px-6 py-2.5 rounded-md hover:bg-blue-dark transition-colors'
              >
                Thử lại
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Breadcrumb title={'Wishlist'} pages={['Wishlist']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div className='flex flex-wrap items-center justify-between gap-5 mb-7.5'>
            <h2 className='font-medium text-dark text-2xl'>
              Danh sách yêu thích ({wishlistItems.length}/50)
            </h2>
            <Link href='/shop-with-sidebar' className='text-blue hover:underline text-sm'>
              Tiếp tục mua sắm
            </Link>
          </div>

          {wishlistItems.length === 0 ? (
            <div className='bg-white rounded-[10px] shadow-1 py-20 flex flex-col items-center justify-center gap-4'>
              <svg
                width='64'
                height='64'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
                  fill='#E5E7EB'
                />
              </svg>
              <p className='text-gray-500 text-lg'>Danh sách yêu thích của bạn đang trống</p>
              <Link
                href='/shop-with-sidebar'
                className='bg-blue text-white px-6 py-2.5 rounded-md hover:bg-blue-dark transition-colors'
              >
                Khám phá sản phẩm
              </Link>
            </div>
          ) : (
            <div className='bg-white rounded-[10px] shadow-1'>
              <div className='w-full overflow-x-auto'>
                <div className='min-w-[1170px]'>
                  {/* Tiêu đề bảng */}
                  <div className='flex items-center py-5.5 px-10'>
                    <div className='min-w-[83px]'></div>
                    <div className='min-w-[387px]'>
                      <p className='text-dark font-medium'>Sản phẩm</p>
                    </div>
                    <div className='min-w-[205px]'>
                      <p className='text-dark font-medium'>Đơn giá</p>
                    </div>
                    <div className='min-w-[265px]'>
                      <p className='text-dark font-medium'>Trạng thái</p>
                    </div>
                    <div className='min-w-[150px]'>
                      <p className='text-dark font-medium text-right'>Thao tác</p>
                    </div>
                  </div>

                  {wishlistItems.map((item) => (
                    <SingleItem item={item} key={item.id} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
