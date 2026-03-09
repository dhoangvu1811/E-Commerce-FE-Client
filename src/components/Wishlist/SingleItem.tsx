'use client'
import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import toast from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import { formatCurrency } from '@/utils/formatCurrency'
import type { WishlistItemResponse } from '@/services/wishlist.service'
import { toggleWishlistItem, selectIsToggling } from '@/redux/slices/wishlistSlice'
import { addItemToCart } from '@/redux/slices/cartSlice'

interface SingleItemProps {
  item: WishlistItemResponse
}

const SingleItem = ({ item }: SingleItemProps) => {
  const dispatch = useAppDispatch()
  const isToggling = useAppSelector(selectIsToggling(item.productId))

  const price = Number(item.product.price)
  const discount = Number(item.product.discount || 0)
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price

  const handleRemoveFromWishlist = () => {
    if (isToggling) return
    dispatch(toggleWishlistItem(item.productId))
  }

  const handleAddToCart = () => {
    if (item.product.stock === 0) {
      toast.error('Sản phẩm này hiện đã hết hàng')

      return
    }
    
    dispatch(
      addItemToCart({
        id: item.product.id,
        name: item.product.name,
        price,
        discountedPrice,
        quantity: 1,
        image: item.product.image || '/images/product/product-01.png',
        stock: item.product.stock
      })
    )
  }

  return (
    <div className='flex items-center border-t border-gray-3 py-5 px-10'>
      {/* Nút xóa */}
      <div className='min-w-[83px]'>
        <button
          onClick={handleRemoveFromWishlist}
          disabled={isToggling}
          aria-label='Xóa sản phẩm khỏi wishlist'
          className='flex items-center justify-center rounded-lg max-w-[38px] w-full h-9.5 bg-gray-2 border border-gray-3 ease-out duration-200 hover:bg-red-light-6 hover:border-red-light-4 hover:text-red disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isToggling ? (
            <svg className='animate-spin' width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
              <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
            </svg>
          ) : (
            <svg
              className='fill-current'
              width='22'
              height='22'
              viewBox='0 0 22 22'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M9.19509 8.22222C8.92661 7.95374 8.49131 7.95374 8.22282 8.22222C7.95433 8.49071 7.95433 8.92601 8.22282 9.1945L10.0284 11L8.22284 12.8056C7.95435 13.074 7.95435 13.5093 8.22284 13.7778C8.49133 14.0463 8.92663 14.0463 9.19511 13.7778L11.0006 11.9723L12.8061 13.7778C13.0746 14.0463 13.5099 14.0463 13.7784 13.7778C14.0469 13.5093 14.0469 13.074 13.7784 12.8055L11.9729 11L13.7784 9.19451C14.0469 8.92603 14.0469 8.49073 13.7784 8.22224C13.5099 7.95376 13.0746 7.95376 12.8062 8.22224L11.0006 10.0278L9.19509 8.22222Z'
                fill=''
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11.0007 1.14587C5.55835 1.14587 1.14648 5.55773 1.14648 11C1.14648 16.4423 5.55835 20.8542 11.0007 20.8542C16.443 20.8542 20.8548 16.4423 20.8548 11C20.8548 5.55773 16.443 1.14587 11.0007 1.14587ZM2.52148 11C2.52148 6.31713 6.31774 2.52087 11.0007 2.52087C15.6836 2.52087 19.4798 6.31713 19.4798 11C19.4798 15.683 15.6836 19.4792 11.0007 19.4792C6.31774 19.4792 2.52148 15.683 2.52148 11Z'
                fill=''
              />
            </svg>
          )}
        </button>
      </div>

      {/* Tên & ảnh sản phẩm */}
      <div className='min-w-[387px]'>
        <div className='flex items-center gap-5.5'>
          <div className='flex items-center justify-center rounded-[5px] bg-gray-2 max-w-[80px] w-full h-17.5 overflow-hidden'>
            <Image
              src={item.product.image || '/images/product/product-01.png'}
              alt={item.product.name}
              width={80}
              height={70}
              className='object-contain w-full h-full'
            />
          </div>
          <div>
            <Link
              href={`/shop-details?id=${item.product.id}`}
              className='text-dark font-medium ease-out duration-200 hover:text-blue line-clamp-2'
            >
              {item.product.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Giá */}
      <div className='min-w-[205px]'>
        <div className='flex flex-col gap-0.5'>
          <p className='text-dark font-medium'>{formatCurrency(discountedPrice)}</p>
          {discount > 0 && (
            <p className='text-gray-500 line-through text-sm'>{formatCurrency(price)}</p>
          )}
        </div>
      </div>

      {/* Trạng thái tồn kho */}
      <div className='min-w-[265px]'>
        <div className='flex items-center gap-1.5'>
          {item.product.stock === 0 ? (
            <span className='text-red text-sm font-medium'>Hết hàng</span>
          ) : discount > 0 ? (
            <>
              <span className='inline-block bg-red/10 text-red text-xs font-medium px-2 py-0.5 rounded'>
                -{discount}%
              </span>
              <span className='text-green-600 text-sm'>Đang khuyến mãi</span>
            </>
          ) : (
            <span className='text-green-600 text-sm'>Còn hàng</span>
          )}
        </div>
      </div>

      {/* Nút thêm vào giỏ */}
      <div className='min-w-[150px] flex justify-end'>
        <button
          onClick={handleAddToCart}
          disabled={item.product.stock === 0}
          className='inline-flex py-2.5 px-6 rounded-md ease-out duration-200 border text-dark hover:text-white bg-gray-1 border-gray-3 hover:bg-blue hover:border-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-1 disabled:hover:text-dark disabled:hover:border-gray-3'
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  )
}

export default SingleItem

