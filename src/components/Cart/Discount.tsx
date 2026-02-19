'use client'
import React, { type KeyboardEvent } from 'react'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import { setVoucherCode, verifyVoucher, removeAppliedVoucher } from '@/redux/slices/voucherSlice'
import { selectTotalPrice } from '@/redux/slices/cartSlice'
import { formatCurrency } from '@/utils/formatCurrency'

const Discount = () => {
  const dispatch = useAppDispatch()
  const totalPrice = useAppSelector(selectTotalPrice)

  const { voucherCode, appliedVoucher, verifying, error } = useAppSelector(
    (state) => state.voucherReducer
  )

  /** Gọi API verify voucher */
  const handleApply = () => {
    const code = voucherCode.trim().toUpperCase()

    if (!code) return
    dispatch(verifyVoucher({ code, orderTotal: totalPrice }))
  }

  /** Nhấn Enter trong input cũng gọi apply */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleApply()
    }
  }

  /** Xóa voucher đã áp dụng */
  const handleRemove = () => {
    dispatch(removeAppliedVoucher())
  }

  const isApplied = Boolean(appliedVoucher)

  return (
    <div className='lg:max-w-[670px] w-full'>
      {/* Coupon box */}
      <div className='bg-white shadow-1 rounded-[10px]'>
        <div className='border-b border-gray-3 py-5 px-4 sm:px-5.5'>
          <h3 className='font-medium text-xl text-dark'>Bạn có mã giảm giá?</h3>
        </div>

        <div className='py-8 px-4 sm:px-8.5'>
          {/* Input + nút áp dụng */}
          <div className='flex flex-wrap gap-4 xl:gap-5.5'>
            <div className='max-w-[426px] w-full'>
              <input
                type='text'
                placeholder='Nhập mã giảm giá'
                value={voucherCode}
                onChange={(e) =>
                  dispatch(setVoucherCode(e.target.value.toUpperCase()))
                }
                onKeyDown={handleKeyDown}
                disabled={isApplied || verifying}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:opacity-60 disabled:cursor-not-allowed uppercase'
              />
            </div>

            {isApplied ? (

              /* Nút xóa voucher */
              <button
                type='button'
                onClick={handleRemove}
                className='inline-flex font-medium text-white bg-red py-3 px-8 rounded-md ease-out duration-200 hover:bg-red-dark'
              >
                Xóa
              </button>
            ) : (

              /* Nút áp dụng */
              <button
                type='button'
                onClick={handleApply}
                disabled={!voucherCode.trim() || verifying}
                className='inline-flex items-center gap-1.5 font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {verifying ? (
                  <>
                    <svg className='animate-spin h-4 w-4' viewBox='0 0 24 24'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                        fill='none'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Đang kiểm tra...
                  </>
                ) : (
                  'Áp dụng'
                )}
              </button>
            )}
          </div>

          {/* Lỗi */}
          {error && (
            <p className='text-red text-sm mt-3 flex items-start gap-1.5'>
              <svg
                className='shrink-0 w-4 h-4 mt-0.5'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {error}
            </p>
          )}

          {/* Thành công - hiển thị thông tin giảm giá */}
          {isApplied && appliedVoucher && (
            <div className='mt-4 p-3 bg-green-light-6 border border-green-light-4 rounded-md'>
              <div className='flex items-center gap-2 mb-1'>
                <svg
                  className='w-4 h-4 text-green shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='text-sm font-medium text-green'>
                  Áp dụng mã &quot;{appliedVoucher.voucher.code}&quot; thành công
                </span>
              </div>
              <p className='text-sm text-dark-5 ml-6'>
                Giảm:{' '}
                <span className='font-semibold text-green'>
                  - {formatCurrency(appliedVoucher.discount)}
                </span>
              </p>
              {appliedVoucher.voucher.description && (
                <p className='text-xs text-dark-5 ml-6 mt-0.5'>
                  {appliedVoucher.voucher.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Discount
