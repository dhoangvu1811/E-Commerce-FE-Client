import React, { useState } from 'react'

import { format } from 'date-fns'

import OrderActions from './OrderActions'
import OrderModal from './OrderModal'
import type { Order} from '@/types/order.type';
import { ORDER_STATUS_NAMES, PAYMENT_STATUS_NAMES } from '@/types/order.type'
import { formatCurrency } from '@/utils/formatCurrency'

interface SingleOrderProps {
  orderItem: Order
  smallView?: boolean
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

const SingleOrder = ({ orderItem, smallView }: SingleOrderProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const toggleDetails = () => setShowDetails(!showDetails)
  const toggleEdit = () => setShowEdit(!showEdit)

  const toggleModal = (status: boolean) => {
    setShowDetails(status)
    setShowEdit(status)
  }

  // Create title from items
  const orderTitle =
    orderItem.items && orderItem.items.length > 0
      ? `${orderItem.items[0].name} ${orderItem.items.length > 1 ? `+ ${orderItem.items.length - 1} sản phẩm khác` : ''}`
      : 'Đơn hàng'

  const formattedDate = orderItem.createdAt
    ? format(new Date(orderItem.createdAt), 'dd/MM/yyyy')
    : 'N/A'

  const statusLabel = ORDER_STATUS_NAMES[orderItem.status] || orderItem.status

  const paymentLabel = orderItem.paymentStatus
    ? PAYMENT_STATUS_NAMES[orderItem.paymentStatus]
    : ''

  return (
    <>
      {!smallView && (
        <div className='items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex'>
          <div className='min-w-[111px] max-w-[111px]'>
            <p className='text-custom-sm text-blue font-medium truncate' title={orderItem.orderCode}>
              #{orderItem.orderCode}
            </p>
          </div>
          <div className='min-w-[175px]'>
            <p className='text-custom-sm text-dark'>{formattedDate}</p>
          </div>

          <div className='min-w-[128px]'>
            <p
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getStatusColor(orderItem.status)}`}
            >
              {statusLabel}
            </p>
          </div>

          <div className='min-w-[213px]'>
            <p
              className='text-custom-sm text-dark truncate pr-4'
              title={orderTitle}
            >
              {orderTitle}
            </p>
          </div>

          <div className='min-w-[113px]'>
            <p className='text-custom-sm text-dark'>
              {formatCurrency(orderItem.totals.payable)}
            </p>
          </div>

          <div className='flex gap-5 items-center'>
            <OrderActions
              orderItem={orderItem}
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className='block md:hidden'>
          <div className='py-4.5 px-7.5'>
            <div>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Đơn hàng:</span> #{orderItem.orderCode}
              </p>
            </div>
            <div>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Ngày:</span> {formattedDate}
              </p>
            </div>

            <div>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Trạng thái:</span>{' '}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] ${getStatusColor(orderItem.status)}`}
                >
                  {statusLabel}
                </span>
              </p>
            </div>

            {paymentLabel && (
              <div>
                <p className='text-custom-sm text-dark'>
                  <span className='font-bold pr-2'>Thanh toán:</span> {paymentLabel}
                </p>
              </div>
            )}

            <div>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Tổng:</span>{' '}
                {formatCurrency(orderItem.totals.payable)}
              </p>
            </div>

            <div>
              <p className='text-custom-sm text-dark flex items-center'>
                <span className='font-bold pr-2'>Thao tác:</span>{' '}
                <OrderActions
                  orderItem={orderItem}
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  )
}

export default SingleOrder
