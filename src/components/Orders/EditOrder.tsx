import React from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch } from '@/redux/store'
import { cancelOrder } from '@/redux/slices/orderSlice'

const EditOrder = ({ order, toggleModal }: any) => {
  const dispatch = useAppDispatch()

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder(order.id)).unwrap()
      toast.success('Order cancelled successfully')
      toggleModal(false)
    } catch (error: any) {
      toast.error(error || 'Failed to cancel order')
    }
  }

  if (
    order.status === 'cancelled' ||
    order.status === 'completed' ||
    order.status === 'shipping'
  ) {
    return (
      <div className='w-full px-10 py-6 text-center'>
        <p className='mb-4 text-dark'>
          Cannot cancel order with status:{' '}
          <span className='font-bold'>{order.status}</span>
        </p>
        <button
          className='rounded-[10px] border border-gray-3 bg-gray-1 py-2 px-6 text-dark hover:bg-gray-2'
          onClick={() => toggleModal(false)}
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className='w-full px-10 py-6'>
      <p className='pb-4 font-medium text-xl text-dark text-center'>
        Cancel Order
      </p>
      <p className='text-center text-gray-600 mb-6'>
        Are you sure you want to cancel Order #{order.id}?
      </p>

      <div className='flex gap-4 justify-center'>
        <button
          className='rounded-[10px] border border-gray-3 bg-gray-1 py-3.5 px-5 text-custom-sm hover:bg-gray-2 transition'
          onClick={() => toggleModal(false)}
        >
          No, Go Back
        </button>

        <button
          className='rounded-[10px] border border-red bg-red text-white py-3.5 px-5 text-custom-sm hover:bg-red-dark transition'
          onClick={handleCancel}
        >
          Yes, Cancel Order
        </button>
      </div>
    </div>
  )
}

export default EditOrder
