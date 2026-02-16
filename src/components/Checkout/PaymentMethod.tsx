'use client'
import React from 'react'

import type { PaymentMethod as PaymentMethodType} from '@/types/order.type';
import { PAYMENT_METHOD_NAMES } from '@/types/order.type'

interface PaymentMethodProps {
  selected: PaymentMethodType
  onChange: (method: PaymentMethodType) => void
}

const paymentOptions: { value: PaymentMethodType; icon: string }[] = [
  { value: 'COD', icon: '💵' },
  { value: 'BANK_TRANSFER', icon: '🏦' },
  { value: 'MOMO', icon: '📱' },
  { value: 'VNPAY', icon: '💳' },
  { value: 'ZALOPAY', icon: '📲' }
]

const PaymentMethod = ({ selected, onChange }: PaymentMethodProps) => {
  return (
    <div className='bg-white shadow-1 rounded-[10px] mt-7.5'>
      <div className='border-b border-gray-3 py-5 px-4 sm:px-8.5'>
        <h3 className='font-medium text-xl text-dark'>Phương thức thanh toán</h3>
      </div>

      <div className='p-4 sm:p-8.5'>
        <div className='flex flex-col gap-3'>
          {paymentOptions.map((option) => (
            <label
              key={option.value}
              htmlFor={`payment-${option.value}`}
              className='flex cursor-pointer select-none items-center gap-4'
            >
              <div className='relative'>
                <input
                  type='radio'
                  name='paymentMethod'
                  id={`payment-${option.value}`}
                  className='sr-only'
                  checked={selected === option.value}
                  onChange={() => onChange(option.value)}
                />
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full ${
                    selected === option.value
                      ? 'border-4 border-blue'
                      : 'border border-gray-4'
                  }`}
                ></div>
              </div>

              <div
                className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none min-w-[240px] ${
                  selected === option.value
                    ? 'border-transparent bg-gray-2'
                    : 'border-gray-4 shadow-1'
                }`}
              >
                <div className='flex items-center'>
                  <div className='pr-2.5 text-xl'>{option.icon}</div>
                  <div className='border-l border-gray-4 pl-2.5'>
                    <p>{PAYMENT_METHOD_NAMES[option.value]}</p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaymentMethod
