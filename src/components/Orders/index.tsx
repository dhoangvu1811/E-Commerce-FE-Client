import React, { useEffect } from 'react'
import SingleOrder from './SingleOrder'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { fetchMyOrders } from '@/redux/slices/orderSlice'

const Orders = () => {
  const dispatch = useAppDispatch()
  const { orders, loading, error, pagination } = useAppSelector(
    (state) => state.orderReducer
  )

  useEffect(() => {
    dispatch(fetchMyOrders({ page: 1, limit: 10 }))
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      dispatch(fetchMyOrders({ page: newPage, limit: 10 }))
    }
  }

  if (loading && orders.length === 0) {
    return <p className='py-4'>Loading orders...</p>
  }

  if (error) {
    return <p className='py-4 text-red'>Error: {error}</p>
  }

  return (
    <>
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[770px]'>
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className='items-center justify-between py-4.5 px-7.5 hidden md:flex '>
              <div className='min-w-[111px]'>
                <p className='text-custom-sm text-dark'>Order</p>
              </div>
              <div className='min-w-[175px]'>
                <p className='text-custom-sm text-dark'>Date</p>
              </div>

              <div className='min-w-[128px]'>
                <p className='text-custom-sm text-dark'>Status</p>
              </div>

              <div className='min-w-[213px]'>
                <p className='text-custom-sm text-dark'>Title</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Total</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Action</p>
              </div>
            </div>
          )}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
              You don&apos;t have any orders!
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex justify-center items-center gap-2 py-4'>
          <button
            onClick={() => handlePageChange((pagination.page || 1) - 1)}
            disabled={(pagination.page || 1) <= 1}
            className='px-3 py-1 border rounded disabled:opacity-50'
          >
            Prev
          </button>
          <span className='text-sm'>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange((pagination.page || 1) + 1)}
            disabled={(pagination.page || 1) >= pagination.totalPages}
            className='px-3 py-1 border rounded disabled:opacity-50'
          >
            Next
          </button>
        </div>
      )}
    </>
  )
}

export default Orders
