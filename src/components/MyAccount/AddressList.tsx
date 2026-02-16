'use client'
import React, { useEffect, useState } from 'react'

import toast from 'react-hot-toast'

import { useAppDispatch, useAppSelector } from '@/redux/store'
import {
  fetchMyAddresses,
  deleteAddress,
  setDefaultAddress,
  selectAddresses,
  selectAddressLoading
} from '@/redux/slices/shippingAddressSlice'
import type { ShippingAddressItem } from '@/types/shippingAddress.type'
import AddressModal from './AddressModal'
import ConfirmationModal from '../Common/ConfirmationModal'

const AddressList = () => {
  const dispatch = useAppDispatch()
  const addresses = useAppSelector(selectAddresses)
  const loading = useAppSelector(selectAddressLoading)

  const [modalOpen, setModalOpen] = useState(false)
  const [editAddress, setEditAddress] = useState<ShippingAddressItem | null>(null)
  
  // Confirmation Modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<ShippingAddressItem | null>(null)

  useEffect(() => {
    dispatch(fetchMyAddresses())
  }, [dispatch])

  const handleCreate = () => {
    setEditAddress(null)
    setModalOpen(true)
  }

  const handleEdit = (address: ShippingAddressItem) => {
    setEditAddress(address)
    setModalOpen(true)
  }

  const handleDeleteClick = (address: ShippingAddressItem) => {
    setAddressToDelete(address)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!addressToDelete) return

    try {
      await dispatch(deleteAddress(addressToDelete.id)).unwrap()
      toast.success('Đã xóa địa chỉ')
      setConfirmOpen(false)
      setAddressToDelete(null)
    } catch (err: any) {
      toast.error(err || 'Không thể xóa địa chỉ')
    }
  }



  const handleSetDefault = async (address: ShippingAddressItem) => {
    if (address.isDefault) return

    try {
      await dispatch(setDefaultAddress(address.id)).unwrap()
      toast.success('Đã đặt làm địa chỉ mặc định')
    } catch (err: any) {
      toast.error(err || 'Không thể đặt mặc định')
    }
  }

  const handleModalSuccess = () => {
    setModalOpen(false)
    setEditAddress(null)
  }

  const handleRetry = () => {
    dispatch(fetchMyAddresses())
  }

  if (loading) {
    return (
      <div className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
        <div className='flex flex-col items-center justify-center gap-3 py-10'>
          <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue'></div>
          <p className='text-dark-5'>Đang tải danh sách địa chỉ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='py-9.5 px-4 sm:px-7.5 xl:px-10'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='font-medium text-xl text-dark'>
          Địa chỉ giao hàng ({addresses.length}/10)
        </h3>
        {addresses.length < 10 && (
          <button
            onClick={handleCreate}
            className='inline-flex items-center gap-1.5 font-medium text-white bg-blue py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue-dark text-sm'
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8 1V15M1 8H15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            Thêm địa chỉ
          </button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className='text-center py-10'>
          <p className='text-dark-5 mb-4'>
            Bạn chưa có địa chỉ giao hàng nào.
          </p>
          <button
            onClick={handleCreate}
            className='inline-flex font-medium text-white bg-blue py-2.5 px-5 rounded-md ease-out duration-200 hover:bg-blue-dark'
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`relative border rounded-lg p-5 transition-colors ${
                addr.isDefault
                  ? 'border-blue bg-blue/5'
                  : 'border-gray-3 bg-white hover:border-blue/40'
              }`}
            >
              {/* Default badge */}
              {addr.isDefault && (
                <span className='absolute top-3 right-3 text-xs font-medium text-white bg-blue px-2 py-0.5 rounded'>
                  Mặc định
                </span>
              )}

              <div className='flex flex-col gap-1.5 pr-20'>
                <p className='font-medium text-dark'>
                  {addr.fullName}{' '}
                  <span className='text-dark-5 font-normal'>
                    | {addr.phone}
                  </span>
                </p>
                <p className='text-custom-sm text-dark-5'>
                  {addr.address}
                </p>
                <p className='text-custom-sm text-dark-5'>
                  {addr.city}, {addr.province}
                  {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                </p>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-3 mt-3 pt-3 border-t border-gray-3'>
                <button
                  onClick={() => handleEdit(addr)}
                  className='text-sm text-blue ease-out duration-200 hover:underline'
                >
                  Sửa
                </button>
                {!addr.isDefault && (
                  <>
                    <span className='text-gray-4'>|</span>
                    <button
                      onClick={() => handleSetDefault(addr)}
                      className='text-sm text-dark-5 ease-out duration-200 hover:text-blue'
                    >
                      Đặt mặc định
                    </button>
                    <span className='text-gray-4'>|</span>
                    <button
                      onClick={() => handleDeleteClick(addr)}
                      className='text-sm text-red ease-out duration-200 hover:underline'
                    >
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditAddress(null)
        }}
        editAddress={editAddress}
        onSuccess={handleModalSuccess}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title='Xóa địa chỉ'
        message={`Bạn có chắc chắn muốn xóa địa chỉ "${addressToDelete?.fullName} - ${addressToDelete?.address}" không?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        confirmText='Xóa'
        cancelText='Hủy'
        isDanger={true}
      />
    </div>
  )
}

export default AddressList
