import React from 'react'
import { Order } from '@/types/order.type'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/formatCurrency'

interface OrderDetailsProps {
  orderItem: Order
}

const OrderDetails = ({ orderItem }: OrderDetailsProps) => {
  const formattedDate = orderItem.createdAt
    ? format(new Date(orderItem.createdAt), 'MMM dd, yyyy')
    : 'N/A'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green bg-green-light-6'
      case 'cancelled':
        return 'text-red bg-red-light-6'
      case 'pending':
        return 'text-yellow bg-yellow-light-4'
      case 'shipping':
        return 'text-blue bg-blue-light-4'
      default:
        return 'text-dark bg-gray-1'
    }
  }

  return (
    <div className='w-full h-full overflow-y-auto px-4 sm:px-8 py-6'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between items-center border-b border-gray-3 pb-4'>
          <div>
            <p className='text-lg font-medium text-dark'>
              Order #{orderItem.id}
            </p>
            <p className='text-sm text-gray-500'>{formattedDate}</p>
          </div>
          <span
            className={`inline-block text-sm py-1 px-3 rounded-full capitalize ${getStatusColor(orderItem.status)}`}
          >
            {orderItem.status}
          </span>
        </div>

        <div className='flex flex-col gap-3'>
          {orderItem.items?.map((item) => (
            <div key={item.id} className='flex justify-between items-center'>
              <div className='flex items-center gap-3'>
                {/* <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 relative overflow-hidden">
                   Image here if available 
                </div> */}
                <div>
                  <p className='text-sm font-medium text-dark'>
                    {item.product?.name || 'Product'}
                  </p>
                  <p className='text-xs text-gray-500'>Qty: {item.quantity}</p>
                </div>
              </div>
              <p className='text-sm font-medium text-dark'>
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className='border-t border-gray-3 pt-4 mt-2'>
          <div className='flex justify-between text-sm mb-2'>
            <span className='text-gray-500'>Subtotal</span>
            <span className='text-dark font-medium'>
              {formatCurrency(orderItem.totalAmount)}
            </span>
          </div>
          <div className='flex justify-between text-sm mb-2'>
            <span className='text-gray-500'>Shipping</span>
            <span className='text-dark font-medium'>
              {formatCurrency(orderItem.shippingFee || 0)}
            </span>
          </div>
          <div className='flex justify-between text-sm mb-2'>
            <span className='text-gray-500'>Discount</span>
            <span className='text-dark font-medium'>
              -{formatCurrency(orderItem.discountAmount || 0)}
            </span>
          </div>
          <div className='flex justify-between text-lg font-bold mt-2'>
            <span className='text-dark'>Total</span>
            <span className='text-dark'>
              {formatCurrency(orderItem.totalAmount)}
            </span>
          </div>
        </div>

        {/* Shipping Address Placeholder - Needs real address data from Order if available */}
        {/* <div className="mt-4">
          <p className="font-medium text-dark mb-1">Shipping Address</p>
          <p className="text-sm text-gray-500">
             Address info fetching...
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default OrderDetails
