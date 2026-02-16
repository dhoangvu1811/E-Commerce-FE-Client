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
    dispatch(fetchMyOrders({ page: 1, itemsPerPage: 10 }))
  }, [dispatch])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      dispatch(fetchMyOrders({ page: newPage, itemsPerPage: 10 }))
    }
  }

  const handleRetry = () => {
    dispatch(fetchMyOrders({ page: pagination.page || 1, itemsPerPage: 10 }))
  }

  if (loading && orders.length === 0) {
    return (
      <div className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
        <div className='flex flex-col items-center justify-center gap-3'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue'></div>
          <p className='text-dark-5'>Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <div className='text-center'>
            <svg
              className='mx-auto h-12 w-12 text-red mb-3'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <p className='text-red font-medium mb-1'>Không thể tải đơn hàng</p>
            <p className='text-dark-5 text-sm mb-4'>{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className='inline-flex items-center gap-2 font-medium text-white bg-blue py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue-dark'
          >
            <svg
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='w-full overflow-x-auto'>
        <div className='min-w-[770px]'>
          {/* <!-- order item --> */}
          {orders.length > 0 && (
            <div className='items-center justify-between py-4.5 px-7.5 hidden md:flex '>
              <div className='min-w-[111px]'>
                <p className='text-custom-sm text-dark'>Mã đơn</p>
              </div>
              <div className='min-w-[175px]'>
                <p className='text-custom-sm text-dark'>Ngày</p>
              </div>

              <div className='min-w-[128px]'>
                <p className='text-custom-sm text-dark'>Trạng thái</p>
              </div>

              <div className='min-w-[213px]'>
                <p className='text-custom-sm text-dark'>Sản phẩm</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Tổng tiền</p>
              </div>

              <div className='min-w-[113px]'>
                <p className='text-custom-sm text-dark'>Thao tác</p>
              </div>
            </div>
          )}
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
              Bạn chưa có đơn hàng nào!
            </p>
          )}
        </div>

        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={key} orderItem={orderItem} smallView={true} />
          ))}
      </div>

      {/* Pagination */}
      {pagination && (pagination.totalPages || 0) > 1 && (
        <div className='flex justify-center items-center gap-2 py-4'>
          <button
            onClick={() => handlePageChange((pagination.page || 1) - 1)}
            disabled={(pagination.page || 1) <= 1}
            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Trước
          </button>
          <span className='text-sm text-dark'>
            Trang {pagination.page || 1} / {pagination.totalPages || 1}
          </span>
          <button
            onClick={() => handlePageChange((pagination.page || 1) + 1)}
            disabled={(pagination.page || 1) >= (pagination.totalPages || 1)}
            className='px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Sau
          </button>
        </div>
      )}
    </>
  )
}

export default Orders
