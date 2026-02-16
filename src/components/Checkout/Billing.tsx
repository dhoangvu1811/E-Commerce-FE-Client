'use client'
import React from 'react'

interface BillingProps {
  name: string
  phone: string
  address: string
  city: string
  province: string
  onChange: (field: string, value: string) => void
}

const Billing = ({ name, phone, address, city, province, onChange }: BillingProps) => {
  const inputClass =
    'rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'

  return (
    <div className='mt-9'>
      <h2 className='font-medium text-dark text-xl sm:text-2xl mb-5.5'>
        Thông tin giao hàng
      </h2>

      <div className='bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5'>
        <div className='mb-5'>
          <label htmlFor='shippingName' className='block mb-2.5'>
            Họ và tên <span className='text-red'>*</span>
          </label>
          <input
            type='text'
            id='shippingName'
            placeholder='Nhập họ và tên người nhận'
            value={name}
            onChange={(e) => onChange('name', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className='mb-5'>
          <label htmlFor='shippingPhone' className='block mb-2.5'>
            Số điện thoại <span className='text-red'>*</span>
          </label>
          <input
            type='tel'
            id='shippingPhone'
            placeholder='Nhập số điện thoại'
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className='mb-5'>
          <label htmlFor='shippingAddress' className='block mb-2.5'>
            Địa chỉ <span className='text-red'>*</span>
          </label>
          <input
            type='text'
            id='shippingAddress'
            placeholder='Số nhà, tên đường'
            value={address}
            onChange={(e) => onChange('address', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className='flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5'>
          <div className='w-full'>
            <label htmlFor='shippingCity' className='block mb-2.5'>
              Thành phố <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              id='shippingCity'
              placeholder='Nhập thành phố'
              value={city}
              onChange={(e) => onChange('city', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className='w-full'>
            <label htmlFor='shippingProvince' className='block mb-2.5'>
              Tỉnh/Thành <span className='text-red'>*</span>
            </label>
            <input
              type='text'
              id='shippingProvince'
              placeholder='Nhập tỉnh/thành'
              value={province}
              onChange={(e) => onChange('province', e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Billing
