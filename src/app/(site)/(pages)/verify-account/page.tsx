import VerifyAccount from '@/components/Auth/VerifyAccount'
import React from 'react'
import { Metadata } from 'next'

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
