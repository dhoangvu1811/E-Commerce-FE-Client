import React from 'react'

import type { Metadata } from 'next'

import Vouchers from '@/components/Vouchers'

export const metadata: Metadata = {
  title: 'Mã Giảm Giá | NextCommerce',
  description: 'Xem và sao chép các mã giảm giá đang có hiệu lực.'
}

const VouchersPage = () => {
  return (
    <main>
      <Vouchers />
    </main>
  )
}

export default VouchersPage
