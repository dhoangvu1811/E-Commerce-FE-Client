import React from 'react'

import { format } from 'date-fns'

import type {
  Order} from '@/types/order.type';
import {
  ORDER_STATUS_NAMES,
  PAYMENT_STATUS_NAMES,
  PAYMENT_METHOD_NAMES
} from '@/types/order.type'


import { formatCurrency } from '@/utils/formatCurrency'

interface OrderDetailsProps {
  orderItem: Order
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'DELIVERED':
      return 'text-green bg-green-light-6'
    case 'CANCELLED':
      return 'text-red bg-red-light-6'
    case 'PENDING':
      return 'text-yellow bg-yellow-light-4'
    case 'SHIPPING':
      return 'text-blue bg-blue-light-4'
    case 'CONFIRMED':
      return 'text-green bg-green-light-6'
    case 'PROCESSING':
      return 'text-orange-500 bg-orange-50'
    default:
      return 'text-dark bg-gray-1'
  }
}

const OrderDetails = ({ orderItem }: OrderDetailsProps) => {
  const formattedDate = orderItem.createdAt
    ? format(new Date(orderItem.createdAt), 'dd/MM/yyyy HH:mm')
    : 'N/A'

  const statusLabel = ORDER_STATUS_NAMES[orderItem.status] || orderItem.status

  const paymentStatusLabel = orderItem.paymentStatus
    ? PAYMENT_STATUS_NAMES[orderItem.paymentStatus]
    : 'N/A'

  const paymentMethodLabel =
    orderItem.payments?.[0]?.paymentMethod
      ? PAYMENT_METHOD_NAMES[orderItem.payments[0].paymentMethod]
      : 'N/A'

  return (
    <div className='w-full h-full overflow-y-auto px-4 sm:px-8 py-6'>
      <div className='flex flex-col gap-4'>
        {/* Header */}
        <div className='flex justify-between items-center border-b border-gray-3 pb-4'>
          <div>
            <p className='text-lg font-medium text-dark'>
              Đơn hàng #{orderItem.orderCode}
            </p>
            <p className='text-sm text-gray-500'>{formattedDate}</p>
          </div>
          <span
            className={`inline-block text-sm py-1 px-3 rounded-full ${getStatusColor(orderItem.status)}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Items */}
        <div className='flex flex-col gap-3'>
          <p className='font-medium text-dark'>Sản phẩm</p>
          {orderItem.items?.map((item, idx) => (
            <div key={idx} className='flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                {item.image && (
                  <div className='w-12 h-12 bg-gray-200 rounded flex-shrink-0 relative overflow-hidden'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}
                <div>
                  <p className='text-sm font-medium text-dark'>{item.name}</p>
                  <p className='text-xs text-gray-500'>
                    {formatCurrency(item.unitPrice)}
                    {item.discount > 0 && (
                      <span className='text-red ml-1'>-{item.discount}%</span>
                    )}
                    {' × '}{item.quantity}
                  </p>
                </div>
              </div>
              <p className='text-sm font-medium text-dark'>
                {formatCurrency(item.lineTotal)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className='border-t border-gray-3 pt-4 mt-2'>
          <div className='flex justify-between text-sm mb-2'>
            <span className='text-gray-500'>Tạm tính</span>
            <span className='text-dark font-medium'>
              {formatCurrency(orderItem.totals.subtotal)}
            </span>
          </div>
          <div className='flex justify-between text-sm mb-2'>
            <span className='text-gray-500'>Phí vận chuyển</span>
            <span className='text-dark font-medium'>
              {orderItem.totals.shippingFee > 0
                ? formatCurrency(orderItem.totals.shippingFee)
                : 'Miễn phí'}
            </span>
          </div>
          {orderItem.totals.discount > 0 && (
            <div className='flex justify-between text-sm mb-2'>
              <span className='text-gray-500'>Giảm giá</span>
              <span className='text-red font-medium'>
                -{formatCurrency(orderItem.totals.discount)}
              </span>
            </div>
          )}
          <div className='flex justify-between text-lg font-bold mt-2'>
            <span className='text-dark'>Tổng thanh toán</span>
            <span className='text-dark'>
              {formatCurrency(orderItem.totals.payable)}
            </span>
          </div>
        </div>

        {/* Shipping Address */}
        {orderItem.shippingAddress && (
          <div className='border-t border-gray-3 pt-4 mt-2'>
            <p className='font-medium text-dark mb-2'>Địa chỉ giao hàng</p>
            <div className='text-sm text-gray-500'>
              <p className='font-medium text-dark-4'>
                {orderItem.shippingAddress.name} —{' '}
                {orderItem.shippingAddress.phone}
              </p>
              <p>
                {orderItem.shippingAddress.address},{' '}
                {orderItem.shippingAddress.city},{' '}
                {orderItem.shippingAddress.province}
              </p>
            </div>
          </div>
        )}

        {/* Payment info */}
        <div className='border-t border-gray-3 pt-4 mt-2'>
          <p className='font-medium text-dark mb-2'>Thanh toán</p>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-500'>Phương thức</span>
            <span className='text-dark'>{paymentMethodLabel}</span>
          </div>
          <div className='flex justify-between text-sm mt-1'>
            <span className='text-gray-500'>Trạng thái</span>
            <span className='text-dark'>{paymentStatusLabel}</span>
          </div>
        </div>

        {/* Voucher */}
        {orderItem.vouchers && orderItem.vouchers.length > 0 && (
          <div className='border-t border-gray-3 pt-4 mt-2'>
            <p className='font-medium text-dark mb-2'>Mã giảm giá</p>
            {orderItem.vouchers.map((v, idx) => (
              <div key={idx} className='flex justify-between text-sm'>
                <span className='text-gray-500'>
                  {v.code} ({v.type === 'PERCENTAGE' ? `${v.amount}%` : formatCurrency(v.amount)})
                </span>
                <span className='text-red'>
                  -{formatCurrency(v.discountApplied)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
