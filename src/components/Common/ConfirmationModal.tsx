import React from 'react'

interface ConfirmationModalProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isDanger?: boolean
}

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isDanger = false
}: ConfirmationModalProps) => {
  if (!isOpen) return null

  return (
    <div className='fixed top-0 left-0 z-999999 flex w-full h-full min-h-screen px-4 py-5 overflow-y-auto bg-dark/90 items-center justify-center backdrop-blur-sm'>
      <div className='w-full max-w-[400px] rounded-lg bg-white p-8 text-center shadow-3'>
        <h3 className='pb-2 text-xl font-bold text-dark sm:text-2xl'>
          {title}
        </h3>
        <p className='mb-8 text-base text-body-color'>{message}</p>
        <div className='flex items-center justify-center gap-4'>
          <button
            onClick={onCancel}
            className='flex w-full items-center justify-center rounded bg-gray-1 py-3 px-6 text-base font-medium text-dark hover:bg-gray-2'
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex w-full items-center justify-center rounded py-3 px-6 text-base font-medium text-white hover:bg-opacity-90 ${
              isDanger ? 'bg-red' : 'bg-blue'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
