'use client'
import React, { useState, useEffect } from 'react'

import toast from 'react-hot-toast'

import { useAppDispatch } from '@/redux/store'
import {
  createAddress,
  updateAddress
} from '@/redux/slices/shippingAddressSlice'
import type {
  ShippingAddressItem,
  CreateShippingAddressPayload,
  UpdateShippingAddressPayload
} from '@/types/shippingAddress.type'

interface AddressModalProps {
  isOpen: boolean
  onClose: () => void
  editAddress: ShippingAddressItem | null
  onSuccess: () => void
}

const AddressModal = ({
  isOpen,
  onClose,
  editAddress,
  onSuccess
}: AddressModalProps) => {
  const dispatch = useAppDispatch()
  const isEditing = !!editAddress

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    isDefault: false
  })

  const [submitting, setSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (editAddress) {
      setForm({
        fullName: editAddress.fullName,
        phone: editAddress.phone,
        address: editAddress.address,
        city: editAddress.city,
        province: editAddress.province,
        postalCode: editAddress.postalCode || '',
        isDefault: editAddress.isDefault
      })
    } else {
      setForm({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        isDefault: false
      })
    }
  }, [editAddress, isOpen])

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    if (!form.fullName.trim()) return toast.error('Vui lòng nhập họ tên')
    if (!form.phone.trim()) return toast.error('Vui lòng nhập số điện thoại')
    if (!form.address.trim()) return toast.error('Vui lòng nhập địa chỉ')
    if (!form.city.trim()) return toast.error('Vui lòng nhập thành phố')
    if (!form.province.trim()) return toast.error('Vui lòng nhập tỉnh/thành')

    setSubmitting(true)

    try {
      if (isEditing) {
        const payload: UpdateShippingAddressPayload = {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          postalCode: form.postalCode.trim() || undefined,
          isDefault: form.isDefault
        }

        await dispatch(
          updateAddress({ id: editAddress!.id, payload })
        ).unwrap()
        toast.success('Cập nhật địa chỉ thành công')
      } else {
        const payload: CreateShippingAddressPayload = {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          province: form.province.trim(),
          postalCode: form.postalCode.trim() || undefined,
          isDefault: form.isDefault
        }

        await dispatch(createAddress(payload)).unwrap()
        toast.success('Thêm địa chỉ thành công')
      }

      onSuccess()
    } catch (err: any) {
      toast.error(err || 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const inputClass =
    'rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'

  return (
    <div className='fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 z-99999'>
      <div className='flex items-center justify-center'>
        <div className='w-full max-w-[600px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content'>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label='Đóng modal'
            className='absolute top-3 right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-meta text-body hover:text-dark'
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M15 5L5 15M5 5L15 15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>

          <h3 className='font-medium text-xl text-dark mb-6'>
            {isEditing ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>

          <form onSubmit={handleSubmit}>
            <div className='flex flex-col lg:flex-row gap-5 mb-5'>
              <div className='w-full'>
                <label htmlFor='addressFullName' className='block mb-2'>
                  Họ và tên <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  id='addressFullName'
                  placeholder='Nhập họ và tên'
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className='w-full'>
                <label htmlFor='addressPhone' className='block mb-2'>
                  Số điện thoại <span className='text-red'>*</span>
                </label>
                <input
                  type='tel'
                  id='addressPhone'
                  placeholder='Nhập số điện thoại'
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className='mb-5'>
              <label htmlFor='addressDetail' className='block mb-2'>
                Địa chỉ chi tiết <span className='text-red'>*</span>
              </label>
              <input
                type='text'
                id='addressDetail'
                placeholder='Số nhà, tên đường, phường/xã'
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className='flex flex-col lg:flex-row gap-5 mb-5'>
              <div className='w-full'>
                <label htmlFor='addressCity' className='block mb-2'>
                  Thành phố <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  id='addressCity'
                  placeholder='Nhập thành phố'
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className='w-full'>
                <label htmlFor='addressProvince' className='block mb-2'>
                  Tỉnh/Thành <span className='text-red'>*</span>
                </label>
                <input
                  type='text'
                  id='addressProvince'
                  placeholder='Nhập tỉnh/thành'
                  value={form.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className='mb-5'>
              <label htmlFor='addressPostalCode' className='block mb-2'>
                Mã bưu chính{' '}
                <span className='text-dark-5 text-sm'>(không bắt buộc)</span>
              </label>
              <input
                type='text'
                id='addressPostalCode'
                placeholder='Nhập mã bưu chính'
                value={form.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Default checkbox */}
            <div className='mb-6'>
              <label className='flex items-center gap-3 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={form.isDefault}
                  onChange={(e) => handleChange('isDefault', e.target.checked)}
                  className='w-4.5 h-4.5 rounded border-gray-3 text-blue focus:ring-blue'
                  disabled={isEditing && editAddress?.isDefault}
                />
                <span className='text-dark text-sm'>
                  Đặt làm địa chỉ mặc định
                </span>
              </label>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='submit'
                disabled={submitting}
                className='inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {submitting
                  ? 'Đang lưu...'
                  : isEditing
                    ? 'Cập nhật'
                    : 'Thêm địa chỉ'}
              </button>
              <button
                type='button'
                onClick={onClose}
                className='inline-flex font-medium text-dark bg-gray-1 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-3'
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddressModal
