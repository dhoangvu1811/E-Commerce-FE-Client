'use client'
import React, { useEffect, useState } from 'react'

import Image from 'next/image'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'

import Breadcrumb from '../Common/Breadcrumb'
import Newsletter from '../Common/Newsletter'
import RecentlyViewdItems from './RecentlyViewd'
import ReviewsTab from './ReviewsTab'
import { usePreviewSlider } from '@/app/context/PreviewSliderContext'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { addItemToCart } from '@/redux/slices/cartSlice'
import {
  toggleWishlistItem,
  selectIsInWishlist,
  selectIsToggling
} from '@/redux/slices/wishlistSlice'

import { fetchProductDetails } from '@/redux/slices/productDetailsSlice'
import PreLoader from '../Common/PreLoader'
import { formatCurrency } from '@/utils/formatCurrency'

const ShopDetails = () => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const queryId = searchParams.get('id')
  const pathIdMatch = pathname?.match(/\/shop-details\/(\d+)/)
  const pathId = pathIdMatch?.[1] || null
  const id = queryId || pathId

  const {
    item: product,
    loading,
    error
  } = useAppSelector((state) => state.productDetailsReducer)

  useEffect(() => {
    if (id && !Number.isNaN(Number(id))) {
      const parsedId = Number(id)

      sessionStorage.setItem('lastViewedProductId', String(parsedId))
      dispatch(fetchProductDetails(parsedId))

      return
    }

    const lastViewedProductId = sessionStorage.getItem('lastViewedProductId')

    if (lastViewedProductId && !Number.isNaN(Number(lastViewedProductId))) {
      router.replace(`/shop-details?id=${lastViewedProductId}`)
    }
  }, [dispatch, id, router])

  const { openPreviewModal } = usePreviewSlider()
  const [previewImg, setPreviewImg] = useState(0)
  const [activeTab, setActiveTab] = useState('tabOne')
  const [quantity, setQuantity] = useState(1)
  const [displayRating, setDisplayRating] = useState<number | null>(null)

  const { isAuthenticated } = useAppSelector((state) => state.authReducer)

  const isInWishlist = useAppSelector(
    product ? selectIsInWishlist(product.id) : () => false
  )
  
  const isWishlistToggling = useAppSelector(
    product ? selectIsToggling(product.id) : () => false
  )

  // Calculate discount percentage if needed or use from API
  const price = product ? Number(product.price) : 0
  const discount = product ? Number(product.discount) : 0
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price
  const currentRating = displayRating ?? Number(product?.rating || 0)

  useEffect(() => {
    if (product) {
      setDisplayRating(Number(product.rating || 0))
    }
  }, [product])

  const tabs = [
    {
      id: 'tabOne',
      title: 'Description'
    },
    {
      id: 'tabTwo',
      title: 'Additional Information'
    },
    {
      id: 'tabThree',
      title: 'Reviews'
    }
  ]

  const handlePreviewSlider = () => {
    openPreviewModal()
  }

  if (loading) return <PreLoader />
  if (!id && !product)
    return <div className='text-center py-20'>Không tìm thấy sản phẩm để hiển thị.</div>
  if (error)
    return <div className='text-center py-20 text-red-500'>{error}</div>
  if (!product)
    return <div className='text-center py-20'>Product not found</div>

  return (
    <>
      <Breadcrumb title={'Shop Details'} pages={['shop details']} />

      {!product ? (
        'Please select a product'
      ) : (
        <>
          <section className='overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28'>
            <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
              <div className='flex flex-col lg:flex-row gap-7.5 xl:gap-17.5'>
                <div className='lg:max-w-[570px] w-full'>
                  <div className='lg:min-h-[512px] rounded-lg shadow-1 bg-gray-2 p-4 sm:p-7.5 relative flex items-center justify-center'>
                    <div>
                      <button
                        onClick={handlePreviewSlider}
                        aria-label='button for zoom'
                        className='gallery__Image w-11 h-11 rounded-[5px] bg-gray-1 shadow-1 flex items-center justify-center ease-out duration-200 text-dark hover:text-blue absolute top-4 lg:top-6 right-4 lg:right-6 z-50'
                      >
                        <svg
                          className='fill-current'
                          width='22'
                          height='22'
                          viewBox='0 0 22 22'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M9.11493 1.14581L9.16665 1.14581C9.54634 1.14581 9.85415 1.45362 9.85415 1.83331C9.85415 2.21301 9.54634 2.52081 9.16665 2.52081C7.41873 2.52081 6.17695 2.52227 5.23492 2.64893C4.31268 2.77292 3.78133 3.00545 3.39339 3.39339C3.00545 3.78133 2.77292 4.31268 2.64893 5.23492C2.52227 6.17695 2.52081 7.41873 2.52081 9.16665C2.52081 9.54634 2.21301 9.85415 1.83331 9.85415C1.45362 9.85415 1.14581 9.54634 1.14581 9.16665L1.14581 9.11493C1.1458 7.43032 1.14579 6.09599 1.28619 5.05171C1.43068 3.97699 1.73512 3.10712 2.42112 2.42112C3.10712 1.73512 3.97699 1.43068 5.05171 1.28619C6.09599 1.14579 7.43032 1.1458 9.11493 1.14581ZM16.765 2.64893C15.823 2.52227 14.5812 2.52081 12.8333 2.52081C12.4536 2.52081 12.1458 2.21301 12.1458 1.83331C12.1458 1.45362 12.4536 1.14581 12.8333 1.14581L12.885 1.14581C14.5696 1.1458 15.904 1.14579 16.9483 1.28619C18.023 1.43068 18.8928 1.73512 19.5788 2.42112C20.2648 3.10712 20.5693 3.97699 20.7138 5.05171C20.8542 6.09599 20.8542 7.43032 20.8541 9.11494V9.16665C20.8541 9.54634 20.5463 9.85415 20.1666 9.85415C19.787 9.85415 19.4791 9.54634 19.4791 9.16665C19.4791 7.41873 19.4777 6.17695 19.351 5.23492C19.227 4.31268 18.9945 3.78133 18.6066 3.39339C18.2186 3.00545 17.6873 2.77292 16.765 2.64893ZM1.83331 12.1458C2.21301 12.1458 2.52081 12.4536 2.52081 12.8333C2.52081 14.5812 2.52227 15.823 2.64893 16.765C2.77292 17.6873 3.00545 18.2186 3.39339 18.6066C3.78133 18.9945 4.31268 19.227 5.23492 19.351C6.17695 19.4777 7.41873 19.4791 9.16665 19.4791C9.54634 19.4791 9.85415 19.787 9.85415 20.1666C9.85415 20.5463 9.54634 20.8541 9.16665 20.8541H9.11494C7.43032 20.8542 6.09599 20.8542 5.05171 20.7138C3.97699 20.5693 3.10712 20.2648 2.42112 19.5788C1.73512 18.8928 1.43068 18.023 1.28619 16.9483C1.14579 15.904 1.1458 14.5696 1.14581 12.885L1.14581 12.8333C1.14581 12.4536 1.45362 12.1458 1.83331 12.1458ZM20.1666 12.1458C20.5463 12.1458 20.8541 12.4536 20.8541 12.8333V12.885C20.8542 14.5696 20.8542 15.904 20.7138 16.9483C20.5693 18.023 20.2648 18.8928 19.5788 19.5788C18.8928 20.2648 18.023 20.5693 16.9483 20.7138C15.904 20.8542 14.5696 20.8542 12.885 20.8541H12.8333C12.4536 20.8541 12.1458 20.5463 12.1458 20.1666C12.1458 19.787 12.4536 19.4791 12.8333 19.4791C14.5812 19.4791 15.823 19.4777 16.765 19.351C17.6873 19.227 18.2186 18.9945 18.6066 18.6066C18.9945 18.2186 19.227 17.6873 19.351 16.765C19.4777 15.823 19.4791 14.5812 19.4791 12.8333C19.4791 12.4536 19.787 12.1458 20.1666 12.1458Z'
                            fill=''
                          />
                        </svg>
                      </button>

                      {product.images && product.images[previewImg] ? (
                        <Image
                          src={product.images[previewImg].image}
                          alt='product preview'
                          width={400}
                          height={400}
                        />
                      ) : (
                        <Image
                          src={product.image}
                          alt='product preview'
                          width={400}
                          height={400}
                        />
                      )}
                    </div>
                  </div>

                  <div className='flex flex-wrap sm:flex-nowrap gap-4.5 mt-6'>
                    {product.images?.map((item, key) => (
                      <button
                        onClick={() => setPreviewImg(key)}
                        key={item.id}
                        className={`flex items-center justify-center w-15 sm:w-25 h-15 sm:h-25 overflow-hidden rounded-lg bg-gray-2 shadow-1 ease-out duration-200 border-2 hover:border-blue ${
                          key === previewImg
                            ? 'border-blue'
                            : 'border-transparent'
                        }`}
                      >
                        <Image
                          width={60}
                          height={60}
                          src={item.image}
                          alt='thumbnail'
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* <!-- product content --> */}
                <div className='max-w-[539px] w-full'>
                  <div className='flex items-center justify-between mb-3'>
                    <h2 className='font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark'>
                      {product.name}
                    </h2>

                    {discount > 0 && (
                      <div className='inline-flex font-medium text-custom-sm text-white bg-blue rounded py-0.5 px-2.5'>
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className='flex flex-wrap items-center gap-5.5 mb-4.5'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex items-center gap-1'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            width='18'
                            height='18'
                            viewBox='0 0 18 18'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M16.7906 6.72187L11.7 5.93438L9.39377 1.09688C9.22502 0.759375 8.77502 0.759375 8.60627 1.09688L6.30002 5.9625L1.23752 6.72187C0.871891 6.77812 0.731266 7.25625 1.01252 7.50938L4.69689 11.3063L3.82502 16.6219C3.76877 16.9875 4.13439 17.2969 4.47189 17.0719L9.05627 14.5687L13.6125 17.0719C13.9219 17.2406 14.3156 16.9594 14.2313 16.6219L13.3594 11.3063L17.0438 7.50938C17.2688 7.25625 17.1563 6.77812 16.7906 6.72187Z'
                              fill={
                                star <= Math.round(currentRating)
                                  ? '#FFA645'
                                  : '#D1D5DB'
                              }
                            />
                          </svg>
                        ))}
                      </div>
                      <span> ({currentRating.toFixed(1)} / 5) </span>
                    </div>

                    <div className='flex items-center gap-1.5'>
                      <span className='text-green'>
                        {' '}
                        {product.status === 'active'
                          ? 'In Stock'
                          : 'Out of Stock'}{' '}
                      </span>
                    </div>
                  </div>

                  <h3 className='font-medium text-custom-1 mb-4.5'>
                    <span className='text-sm sm:text-base text-dark'>
                      Price: {formatCurrency(discountedPrice)}
                    </span>
                    {discount > 0 && (
                      <span className='line-through text-gray-500 ml-2'>
                        {formatCurrency(price)}
                      </span>
                    )}
                  </h3>

                  <div
                    className='mb-6 text-gray-600 space-y-2 product-description'
                    dangerouslySetInnerHTML={{
                      __html: product.description || ''
                    }}
                  />

                  {/* <!-- Quantity + Actions --> */}
                  <div className='flex items-center gap-4 mb-4.5'>
                    <div className='flex items-center border border-gray-3 rounded-md overflow-hidden'>
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className='w-10 h-10 flex items-center justify-center text-dark hover:bg-gray-2 ease-out duration-200'
                      >
                        <svg width='16' height='2' viewBox='0 0 16 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M0 1H16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                        </svg>
                      </button>
                      <span className='w-12 h-10 flex items-center justify-center font-medium text-dark border-x border-gray-3'>
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className='w-10 h-10 flex items-center justify-center text-dark hover:bg-gray-2 ease-out duration-200'
                      >
                        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M8 0V16M0 8H16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                        </svg>
                      </button>
                    </div>
                    <span className='text-custom-sm text-dark-4'>
                      {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                    </span>
                  </div>

                  <div className='flex flex-wrap items-center gap-4'>
                    <button
                      onClick={() => {
                        if (product.stock === 0) return
                        dispatch(
                          addItemToCart({
                            id: product.id,
                            name: product.name,
                            price,
                            image: product.image || product.images?.[0]?.image || '/images/product/product-01.png',
                            discountedPrice,
                            quantity,
                            stock: product.stock
                          })
                        )
                      }}
                      disabled={product.stock === 0}
                      className='flex items-center gap-2 font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M2.5 3.33334H3.57918C3.76328 3.33334 3.92449 3.45199 3.97575 3.62882L6.02425 10.7046C6.07551 10.8814 6.23672 11 6.42082 11H14.5833C14.7717 11 14.9355 10.8763 14.9831 10.6944L16.4831 4.86108C16.5488 4.60887 16.3535 4.16667 16.0833 4.16667H5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                        <circle cx='7.5' cy='14.1667' r='1.25' fill='currentColor' />
                        <circle cx='13.3333' cy='14.1667' r='1.25' fill='currentColor' />
                      </svg>
                      Thêm vào giỏ
                    </button>

                    <button
                      onClick={() => {
                        if (product.stock === 0) return
                        dispatch(
                          addItemToCart({
                            id: product.id,
                            name: product.name,
                            price,
                            image: product.image || product.images?.[0]?.image || '/images/product/product-01.png',
                            discountedPrice,
                            quantity,
                            stock: product.stock
                          })
                        )
                        router.push('/cart')
                      }}
                      disabled={product.stock === 0}
                      className='font-medium text-white bg-dark py-3 px-7 rounded-md ease-out duration-200 hover:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Mua ngay
                    </button>

                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push('/signin')

                          return
                        }
                        
                        dispatch(toggleWishlistItem(product.id))
                      }}
                      disabled={isWishlistToggling}
                      className={`w-11 h-11 flex items-center justify-center rounded-md border ease-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isInWishlist
                          ? 'border-red text-red bg-red/5'
                          : 'border-gray-3 text-dark hover:text-red hover:border-red'
                      }`}
                      aria-label={isInWishlist ? 'Xóa khỏi wishlist' : 'Thêm vào wishlist'}
                    >
                      <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M10 16.6667C10 16.6667 2.5 12.5 2.5 7.08333C2.5 5.84107 3.30089 4.16667 5 3.33333C6.69911 2.5 8.61111 3.05556 10 4.44444C11.3889 3.05556 13.3009 2.5 15 3.33333C16.6991 4.16667 17.5 5.84107 17.5 7.08333C17.5 12.5 10 16.6667 10 16.6667Z'
                          fill={isInWishlist ? 'currentColor' : 'none'}
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className='overflow-hidden bg-gray-2 py-20'>
            <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
              {/* <!--== tab header start ==--> */}
              <div className='flex flex-wrap items-center bg-white rounded-[10px] shadow-1 gap-5 xl:gap-12.5 py-4.5 px-4 sm:px-6'>
                {tabs.map((item, key) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(item.id)}
                    className={`font-medium lg:text-lg ease-out duration-200 hover:text-blue relative before:h-0.5 before:bg-blue before:absolute before:left-0 before:bottom-0 before:ease-out before:duration-200 hover:before:w-full ${
                      activeTab === item.id
                        ? 'text-blue before:w-full'
                        : 'text-dark before:w-0'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              {/* <!--== tab header end ==--> */}

              {/* <!--== tab content start ==--> */}
              {/* <!-- tab content one start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                    activeTab === 'tabOne' ? 'flex' : 'hidden'
                  }`}
                >
                  <div className='max-w-[670px] w-full'>
                    <h2 className='font-medium text-2xl text-dark mb-7'>
                      Specifications:
                    </h2>

                    <p className='mb-6'>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book.
                    </p>
                    <p className='mb-6'>
                      It has survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s.
                    </p>
                    <p>
                      with the release of Letraset sheets containing Lorem Ipsum
                      passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions.
                    </p>
                  </div>

                  <div className='max-w-[447px] w-full'>
                    <h2 className='font-medium text-2xl text-dark mb-7'>
                      Care & Maintenance:
                    </h2>

                    <p className='mb-6'>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book.
                    </p>
                    <p>
                      It has survived not only five centuries, but also the leap
                      into electronic typesetting, remaining essentially
                      unchanged. It was popularised in the 1960s.
                    </p>
                  </div>
                </div>
              </div>
              {/* <!-- tab content one end --> */}

              {/* <!-- tab content two start --> */}
              <div>
                <div
                  className={`rounded-xl bg-white shadow-1 p-4 sm:p-6 mt-10 ${
                    activeTab === 'tabTwo' ? 'block' : 'hidden'
                  }`}
                >
                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>Brand</p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>Apple</p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>Model</p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        iPhone 14 Plus
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Display Size
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        6.7 inches
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Display Type
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Super Retina XDR OLED, HDR10, Dolby Vision, 800 nits
                        (HBM), 1200 nits (peak)
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Display Resolution
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        1284 x 2778 pixels, 19.5:9 ratio
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>Chipset</p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Apple A15 Bionic (5 nm)
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>Memory</p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        128GB 6GB RAM | 256GB 6GB RAM | 512GB 6GB RAM
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Main Camera
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        12MP + 12MP | 4K@24/25/30/60fps, stereo sound rec.
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Selfie Camera
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        12 MP | 4K@24/25/30/60fps, 1080p@25/30/60/120fps,
                        gyro-EIS
                      </p>
                    </div>
                  </div>

                  {/* <!-- info item --> */}
                  <div className='rounded-md even:bg-gray-1 flex py-4 px-4 sm:px-5'>
                    <div className='max-w-[450px] min-w-[140px] w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Battery Info
                      </p>
                    </div>
                    <div className='w-full'>
                      <p className='text-sm sm:text-base text-dark'>
                        Li-Ion 4323 mAh, non-removable | 15W wireless (MagSafe),
                        7.5W wireless (Qi)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- tab content two end --> */}

              {/* <!-- tab content three start --> */}
              <div>
                <div
                  className={`flex-col sm:flex-row gap-7.5 xl:gap-12.5 mt-12.5 ${
                    activeTab === 'tabThree' ? 'flex' : 'hidden'
                  }`}
                >
                  <ReviewsTab
                    productId={product.id}
                    isAuthenticated={isAuthenticated}
                    onRequireAuth={() => router.push('/signin')}
                    onReviewCreated={(averageRating) => setDisplayRating(averageRating)}
                  />
                </div>
              </div>
              {/* <!-- tab content three end --> */}
              {/* <!--== tab content end ==--> */}
            </div>
          </section>

          <RecentlyViewdItems />

          <Newsletter />
        </>
      )}
    </>
  )
}

export default ShopDetails
