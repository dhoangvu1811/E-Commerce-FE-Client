import React from 'react'

import type { Metadata } from 'next'

import VerifyAccount from '@/components/Auth/VerifyAccount'

export const metadata: Metadata = {
  title: 'Verify Account | NextCommerce Nextjs E-commerce template',
  description: 'This is Verify Account Page for NextCommerce Template'
}

const VerifyAccountPage = () => {
  return (
    <main>
      <VerifyAccount />
    </main>
  )
}

export default VerifyAccountPage
