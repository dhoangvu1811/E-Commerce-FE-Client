'use client'
import React from 'react'

interface CouponProps {
  voucherCode: string
  onChange: (code: string) => void
}

const Coupon = ({ voucherCode, onChange }: CouponProps) => {
  return (
    <div className='bg-white shadow-1 rounded-[10px] mt-7.5'>
      <div className='border-b border-gray-3 py-5 px-4 sm:px-8.5'>
        <h3 className='font-medium text-xl text-dark'>Mã giảm giá</h3>
      </div>

      <div className='py-8 px-4 sm:px-8.5'>
        <div className='flex gap-4'>
          <input
            type='text'
            name='coupon'
            id='coupon'
            placeholder='Nhập mã giảm giá'
            value={voucherCode}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
          />
        </div>
        {voucherCode && (
          <p className='text-sm text-green mt-2'>
            Mã &quot;{voucherCode}&quot; sẽ được áp dụng khi đặt hàng
          </p>
        )}
      </div>
    </div>
  )
}

export default Coupon
