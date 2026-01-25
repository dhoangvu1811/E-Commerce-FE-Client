import React, { useState } from 'react'
import OrderActions from './OrderActions'
import OrderModal from './OrderModal'
import { Order } from '@/types/order.type'
import { format } from 'date-fns'
import { formatCurrency } from '@/utils/formatCurrency'

interface SingleOrderProps {
  orderItem: Order
  smallView?: boolean
}

const SingleOrder = ({ orderItem, smallView }: SingleOrderProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const toggleEdit = () => {
    setShowEdit(!showEdit)
  }

  const toggleModal = (status: boolean) => {
    setShowDetails(status)
    setShowEdit(status)
  }

  // Helper to generate a title or description from items
  const orderTitle =
    orderItem.items && orderItem.items.length > 0
      ? `${orderItem.items[0].product?.name || 'Product'} ${orderItem.items.length > 1 ? `+ ${orderItem.items.length - 1} more` : ''}`
      : 'Order'

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
    <>
      {!smallView && (
        <div className='items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex'>
          <div className='min-w-[111px]'>
            <p className='text-custom-sm text-red'>#{orderItem.id}</p>
          </div>
          <div className='min-w-[175px]'>
            <p className='text-custom-sm text-dark'>{formattedDate}</p>
          </div>

          <div className='min-w-[128px]'>
            <p
              className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${getStatusColor(orderItem.status)}`}
            >
              {orderItem.status}
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
              {formatCurrency(orderItem.totalAmount)}
            </p>
          </div>

          <div className='flex gap-5 items-center'>
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className='block md:hidden'>
          <div className='py-4.5 px-7.5'>
            <div className=''>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'> Order:</span> #{orderItem.id}
              </p>
            </div>
            <div className=''>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Date:</span> {formattedDate}
              </p>
            </div>

            <div className=''>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Status:</span>{' '}
                <span
                  className={`inline-block text-custom-sm  py-0.5 px-2.5 rounded-[30px] capitalize ${getStatusColor(orderItem.status)}`}
                >
                  {orderItem.status}
                </span>
              </p>
            </div>

            <div className=''>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Title:</span> {orderTitle}
              </p>
            </div>

            <div className=''>
              <p className='text-custom-sm text-dark'>
                <span className='font-bold pr-2'>Total:</span>{' '}
                {formatCurrency(orderItem.totalAmount)}
              </p>
            </div>

            <div className=''>
              <p className='text-custom-sm text-dark flex items-center'>
                <span className='font-bold pr-2'>Actions:</span>{' '}
                <OrderActions
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
