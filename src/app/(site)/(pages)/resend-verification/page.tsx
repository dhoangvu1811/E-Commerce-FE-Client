import React from 'react'

import type { Metadata } from 'next'

import ResendVerification from '@/components/Auth/ResendVerification'

export const metadata: Metadata = {
  title: 'Resend Verification | NextCommerce Nextjs E-commerce template',
  description: 'This is Resend Verification Page for NextCommerce Template'
}

const ResendVerificationPage = () => {
  return (
    <main>
      <ResendVerification />
    </main>
  )
}

export default ResendVerificationPage
