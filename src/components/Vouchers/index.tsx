'use client'
import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import { fetchActiveVouchers } from '@/redux/slices/voucherSlice'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Voucher } from '@/types/voucher.type'

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return ''

  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const isExpiringSoon = (endDate: string | null): boolean => {
  if (!endDate) return false
  const diff = new Date(endDate).getTime() - Date.now()

  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000 // < 3 ngày
}

const getUsagePercent = (used: number, limit: number | null): number => {
  if (!limit) return 0

  return Math.min(100, Math.round((used / limit) * 100))
}

// ─── VoucherCard ─────────────────────────────────────────────────────────────

const VoucherCard = ({ voucher }: { voucher: Voucher }) => {
  const [copied, setCopied] = useState(false)
  const expiringSoon = isExpiringSoon(voucher.endDate)
  const usagePct = getUsagePercent(voucher.usedCount, voucher.usageLimit)
  const isPercent = voucher.type === 'percent'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(voucher.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback cho browser cũ
      const el = document.createElement('input')

      el.value = voucher.code
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className='bg-white rounded-[10px] shadow-1 overflow-hidden flex flex-col sm:flex-row'>
      {/* Cột trái — giá trị giảm giá */}
      <div
        className={`flex-shrink-0 flex flex-col items-center justify-center px-6 py-6 sm:w-36 text-white ${
          isPercent ? 'bg-blue' : 'bg-green'
        }`}
      >
        <span className='text-3xl font-bold leading-none'>
          {isPercent ? `${voucher.amount}%` : formatCurrency(voucher.amount)}
        </span>
        <span className='text-xs mt-1 opacity-80 uppercase tracking-wide'>
          {isPercent ? 'Giảm' : 'Giảm cố định'}
        </span>
      </div>

      {/* Phần giữa — thông tin chi tiết */}
      <div className='flex-1 px-5 py-4 flex flex-col gap-2'>
        {/* Header: tên + badge */}
        <div className='flex items-center gap-2 flex-wrap'>
          <h3 className='font-semibold text-dark text-base'>
            {voucher.description || (isPercent ? `Giảm ${voucher.amount}% cho đơn hàng` : `Giảm ${formatCurrency(voucher.amount)}`)}
          </h3>

          {expiringSoon && (
            <span className='text-2xs font-medium text-white bg-red px-2 py-0.5 rounded-full'>
              Sắp hết hạn
            </span>
          )}
        </div>

        {/* Điều kiện áp dụng */}
        <div className='flex flex-wrap gap-x-5 gap-y-1 text-sm text-dark-5'>
          {voucher.minOrderValue != null && voucher.minOrderValue > 0 && (
            <span>
              Đơn tối thiểu:{' '}
              <span className='text-dark font-medium'>
                {formatCurrency(voucher.minOrderValue)}
              </span>
            </span>
          )}

          {isPercent && voucher.maxDiscount != null && (
            <span>
              Giảm tối đa:{' '}
              <span className='text-dark font-medium'>
                {formatCurrency(voucher.maxDiscount)}
              </span>
            </span>
          )}
        </div>

        {/* Thời hạn */}
        <div className='flex flex-wrap gap-x-5 gap-y-1 text-xs text-dark-5'>
          {voucher.startDate && (
            <span>Từ: {formatDate(voucher.startDate)}</span>
          )}
          {voucher.endDate && (
            <span className={expiringSoon ? 'text-red font-medium' : ''}>
              Đến: {formatDate(voucher.endDate)}
            </span>
          )}
        </div>

        {/* Thanh tiến trình lượt dùng */}
        {voucher.usageLimit != null && (
          <div className='mt-1'>
            <div className='flex justify-between text-xs text-dark-5 mb-1'>
              <span>
                Đã dùng {voucher.usedCount}/{voucher.usageLimit} lượt
              </span>
              <span>{usagePct}%</span>
            </div>
            <div className='h-1.5 bg-gray-3 rounded-full overflow-hidden'>
              <div
                className={`h-full rounded-full transition-all ${
                  usagePct >= 80 ? 'bg-red' : 'bg-blue'
                }`}
                style={{ width: `${usagePct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cột phải — mã + nút sao chép */}
      <div className='flex-shrink-0 flex flex-col items-center justify-center gap-3 px-5 py-4 border-t sm:border-t-0 sm:border-l border-dashed border-gray-3'>
        <span className='font-mono font-bold text-dark tracking-widest text-sm bg-gray-1 border border-gray-3 px-3 py-1.5 rounded-md uppercase'>
          {voucher.code}
        </span>

        <button
          type='button'
          onClick={handleCopy}
          className={`text-sm font-medium py-2 px-5 rounded-md ease-out duration-200 whitespace-nowrap ${
            copied
              ? 'bg-green text-white'
              : 'bg-blue text-white hover:bg-blue-dark'
          }`}
        >
          {copied ? (
            <span className='flex items-center gap-1.5'>
              <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              Đã sao chép!
            </span>
          ) : (
            <span className='flex items-center gap-1.5'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                />
              </svg>
              Sao chép
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Skeleton loading ─────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className='bg-white rounded-[10px] shadow-1 overflow-hidden flex flex-col sm:flex-row animate-pulse'>
    <div className='flex-shrink-0 sm:w-36 h-28 sm:h-auto bg-gray-3' />
    <div className='flex-1 px-5 py-4 flex flex-col gap-3'>
      <div className='h-4 bg-gray-3 rounded w-2/3' />
      <div className='h-3 bg-gray-3 rounded w-1/2' />
      <div className='h-3 bg-gray-3 rounded w-1/3' />
    </div>
    <div className='flex-shrink-0 flex flex-col items-center justify-center gap-3 px-5 py-4 border-t sm:border-t-0 sm:border-l border-dashed border-gray-3'>
      <div className='h-8 bg-gray-3 rounded w-28' />
      <div className='h-9 bg-gray-3 rounded w-24' />
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const Vouchers = () => {
  const dispatch = useAppDispatch()

  const { activeVouchers, loadingActive } = useAppSelector(
    (state) => state.voucherReducer
  )

  useEffect(() => {
    dispatch(fetchActiveVouchers(undefined))
  }, [dispatch])

  return (
    <>
      {/* Breadcrumb */}
      <section className='overflow-hidden py-5 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <ul className='flex items-center gap-2'>
            <li>
              <Link className='font-medium text-dark ease-out duration-200 hover:text-blue' href='/'>
                Trang chủ
              </Link>
            </li>
            <li className='text-dark-5'>/</li>
            <li className='text-dark-5'>Mã giảm giá</li>
          </ul>
        </div>
      </section>

      {/* Nội dung chính */}
      <section className='overflow-hidden py-12 bg-gray-2'>
        <div className='max-w-[860px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          {/* Tiêu đề */}
          <div className='mb-8'>
            <h1 className='font-bold text-dark text-2xl sm:text-3xl mb-2'>
              Mã giảm giá
            </h1>
            <p className='text-dark-5'>
              Áp dụng mã giảm giá khi thanh toán để nhận ưu đãi tốt nhất.
            </p>
          </div>

          {/* Hướng dẫn sử dụng */}
          <div className='bg-blue/5 border border-blue/20 rounded-[10px] px-5 py-4 mb-8 flex gap-3'>
            <svg
              className='w-5 h-5 text-blue flex-shrink-0 mt-0.5'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            <p className='text-sm text-dark-5'>
              Sao chép mã, sau đó dán vào ô{' '}
              <span className='font-medium text-dark'>&quot;Mã giảm giá&quot;</span> ở trang{' '}
              <Link href='/cart' className='text-blue hover:underline font-medium'>
                Giỏ hàng
              </Link>{' '}
              hoặc{' '}
              <Link href='/checkout' className='text-blue hover:underline font-medium'>
                Thanh toán
              </Link>{' '}
              để áp dụng.
            </p>
          </div>

          {/* Danh sách voucher */}
          <div className='flex flex-col gap-4'>
            {loadingActive ? (

              // Skeleton
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : activeVouchers.length === 0 ? (

              // Trạng thái rỗng
              <div className='text-center py-16 bg-white rounded-[10px] shadow-1'>
                <svg
                  className='mx-auto w-16 h-16 text-gray-3 mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z'
                  />
                </svg>
                <p className='text-dark font-medium mb-1'>
                  Chưa có mã giảm giá nào
                </p>
                <p className='text-dark-5 text-sm'>
                  Hãy quay lại sau để xem các ưu đãi mới nhất.
                </p>
              </div>
            ) : (
              activeVouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))
            )}
          </div>

          {/* Nút về giỏ hàng */}
          {!loadingActive && activeVouchers.length > 0 && (
            <div className='mt-8 text-center'>
              <Link
                href='/cart'
                className='inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
                Đến giỏ hàng
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Vouchers
