'use client'
import React, { useState, useMemo, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'

import Breadcrumb from '../Common/Breadcrumb'
import Billing from './Billing'
import PaymentMethod from './PaymentMethod'
import Coupon from './Coupon'
import { formatCurrency } from '@/utils/formatCurrency'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { selectCartItems, selectTotalPrice, removeAllItemsFromCart } from '@/redux/slices/cartSlice'
import { createOrder, clearOrderError } from '@/redux/slices/orderSlice'
import { resetVoucher } from '@/redux/slices/voucherSlice'
import { fetchMyAddresses, selectAddresses } from '@/redux/slices/shippingAddressSlice'
import type { PaymentMethod as PaymentMethodType, CreateOrderPayload } from '@/types/order.type'

const Checkout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const cartItems = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectTotalPrice)
  const { creating, error } = useAppSelector((state) => state.orderReducer)
  const addresses = useAppSelector(selectAddresses)
  
  // Lấy state voucher từ Redux
  const { appliedVoucher, voucherCode } = useAppSelector((state) => state.voucherReducer)

  // Selected saved address id (null = initial load, '' = new address)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: ''
  })

  // Fetch saved addresses on mount
  useEffect(() => {
    dispatch(fetchMyAddresses())
  }, [dispatch])

  // Auto-fill default address only on initial load
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === null) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0]

      setSelectedAddressId(String(defaultAddr.id))
      setShippingAddress({
        name: defaultAddr.fullName,
        phone: defaultAddr.phone,
        address: defaultAddr.address,
        city: defaultAddr.city,
        province: defaultAddr.province
      })
    }
  }, [addresses, selectedAddressId])

  // Handle address selection
  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id)

    if (id === '') {
      setShippingAddress({ name: '', phone: '', address: '', city: '', province: '' })
      
return
    }

    const addr = addresses.find((a) => String(a.id) === id)

    if (addr) {
      setShippingAddress({
        name: addr.fullName,
        phone: addr.phone,
        address: addr.address,
        city: addr.city,
        province: addr.province
      })
    }
  }

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('COD')

  // Shipping fee (fixed for now)
  const shippingFee = 0

  // Discount từ voucher đã verify
  const discount = appliedVoucher?.discount ?? 0

  // Validation errors
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Totals
  const total = useMemo(() => {
    return Math.max(0, subtotal + shippingFee - discount)
  }, [subtotal, shippingFee, discount])

  const handleShippingChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const errors: string[] = []

    if (cartItems.length === 0) {
      errors.push('Giỏ hàng đang trống')
    }

    if (!shippingAddress.name.trim()) {
      errors.push('Vui lòng nhập họ và tên người nhận')
    }

    if (!shippingAddress.phone.trim()) {
      errors.push('Vui lòng nhập số điện thoại')
    }

    if (!shippingAddress.address.trim()) {
      errors.push('Vui lòng nhập địa chỉ')
    }

    if (!shippingAddress.city.trim()) {
      errors.push('Vui lòng nhập thành phố')
    }

    if (!shippingAddress.province.trim()) {
      errors.push('Vui lòng nhập tỉnh/thành')
    }

    setFormErrors(errors)
    
return errors.length === 0
  }

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearOrderError())
    }
  }, [dispatch])

  // Clear form errors when shipping address changes
  useEffect(() => {
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }, [shippingAddress])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearOrderError())

    if (!validateForm()) return

    const payload: CreateOrderPayload = {
      items: cartItems.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity
      })),
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        province: shippingAddress.province.trim()
      },
      paymentMethod,
      shippingFee,
      ...(voucherCode.trim() && { voucherCode: voucherCode.trim() })
    }

    try {
      const result = await dispatch(createOrder(payload)).unwrap()


      // Clear cart và voucher sau khi đặt hàng thành công
      dispatch(removeAllItemsFromCart())
      dispatch(resetVoucher())
      toast.success(`Đặt hàng thành công! Mã đơn: ${result?.orderCode || 'N/A'}`)
      router.push('/my-account')
    } catch (err: any) {
      // Error already set in Redux, toast for user feedback
      const errorMsg = typeof err === 'string' ? err : 'Có lỗi xảy ra khi đặt hàng'

      toast.error(errorMsg)
      console.error('Order creation error:', err)
    }
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Breadcrumb title={'Thanh toán'} pages={['Thanh toán']} />
        <section className='overflow-hidden py-20 bg-gray-2'>
          <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
            <div className='text-center py-16'>
              <p className='text-lg text-dark-5 mb-6'>
                Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.
              </p>
              <button
                onClick={() => router.push('/shop-with-sidebar')}
                className='inline-flex font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark'
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Breadcrumb title={'Thanh toán'} pages={['Thanh toán']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <form onSubmit={handleSubmit}>
            <div className='flex flex-col lg:flex-row gap-7.5 xl:gap-11'>
              {/* Checkout left - Billing form */}
              <div className='lg:max-w-[670px] w-full'>
                {/* Saved address selectbox */}
                {addresses.length > 0 && (
                  <div className='mb-6'>
                    <label className='block mb-2.5 font-medium text-dark'>
                      Chọn địa chỉ đã lưu
                    </label>
                    <select
                      value={selectedAddressId || ''}
                      onChange={(e) => handleAddressSelect(e.target.value)}
                      className='rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    >
                      <option value=''>-- Nhập địa chỉ mới --</option>
                      {addresses.map((addr) => (
                        <option key={addr.id} value={String(addr.id)}>
                          {addr.fullName} - {addr.phone} - {addr.address}, {addr.city}{addr.isDefault ? ' ★' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Billing
                  name={shippingAddress.name}
                  phone={shippingAddress.phone}
                  address={shippingAddress.address}
                  city={shippingAddress.city}
                  province={shippingAddress.province}
                  onChange={handleShippingChange}
                />

              </div>

              {/* Checkout right - Order summary */}
              <div className='max-w-[455px] w-full'>
                {/* Order list */}
                <div className='bg-white shadow-1 rounded-[10px]'>
                  <div className='border-b border-gray-3 py-5 px-4 sm:px-8.5'>
                    <h3 className='font-medium text-xl text-dark'>
                      Đơn hàng của bạn
                    </h3>
                  </div>

                  <div className='pt-2.5 pb-8.5 px-4 sm:px-8.5'>
                    {/* Header */}
                    <div className='flex items-center justify-between py-5 border-b border-gray-3'>
                      <h4 className='font-medium text-dark'>Sản phẩm</h4>
                      <h4 className='font-medium text-dark text-right'>
                        Thành tiền
                      </h4>
                    </div>

                    {/* Cart items */}
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center justify-between py-5 border-b border-gray-3'
                      >
                        <div className='pr-4'>
                          <p className='text-dark'>
                            {item.name}{' '}
                            <span className='text-dark-5'>x{item.quantity}</span>
                          </p>
                        </div>
                        <div>
                          <p className='text-dark text-right whitespace-nowrap'>
                            {formatCurrency(item.discountedPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Giảm giá voucher */}
                    {discount > 0 && (
                      <div className='flex items-center justify-between py-5 border-b border-gray-3'>
                        <p className='text-green'>
                          Giảm giá
                          {appliedVoucher?.voucher.code && (
                            <span className='ml-1 text-xs bg-green-light-6 text-green px-1.5 py-0.5 rounded font-mono'>
                              {appliedVoucher.voucher.code}
                            </span>
                          )}
                        </p>
                        <p className='text-green text-right font-medium'>
                          - {formatCurrency(discount)}
                        </p>
                      </div>
                    )}

                    {/* Shipping fee */}
                    <div className='flex items-center justify-between py-5 border-b border-gray-3'>
                      <p className='text-dark'>Phí vận chuyển</p>
                      <p className='text-dark text-right'>
                        {shippingFee > 0
                          ? formatCurrency(shippingFee)
                          : 'Miễn phí'}
                      </p>
                    </div>

                    {/* Total */}
                    <div className='flex items-center justify-between pt-5'>
                      <p className='font-medium text-lg text-dark'>Tổng cộng</p>
                      <p className='font-medium text-lg text-dark text-right'>
                        {formatCurrency(total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coupon - truyền subtotal để có thể tính discount */}
                <Coupon subtotal={subtotal} />

                {/* Payment method */}
                <PaymentMethod
                  selected={paymentMethod}
                  onChange={setPaymentMethod}
                />

                {/* Errors */}
                {(formErrors.length > 0 || error) && (
                  <div className='mt-4 p-4 bg-red-light-6 rounded-md'>
                    {formErrors.map((err, idx) => (
                      <p key={idx} className='text-red text-sm'>
                        • {err}
                      </p>
                    ))}
                    {error && (
                      <p className='text-red text-sm'>• {error}</p>
                    )}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type='submit'
                  disabled={creating}
                  className='w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {creating ? (
                    <span className='flex items-center gap-2'>
                      <svg
                        className='animate-spin h-5 w-5'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          fill='none'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Đặt hàng'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Checkout
