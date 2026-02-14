'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/redux/store'
import { verifyAccount } from '@/redux/slices/authSlice'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Link from 'next/link'
import toast from 'react-hot-toast'

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const email = searchParams.get('email')
    const token = searchParams.get('token')

    if (!email || !token) {
      setStatus('error')
      setMessage('Invalid verification link. Email and token are required.')
      return
    }

    const verify = async () => {
      try {
        await dispatch(verifyAccount({ email, token })).unwrap()
        toast.success('Account verified successfully!')
        setStatus('success')
        setMessage('Your account has been verified successfully!')
        
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } catch (error: any) {
        // Error toast handled by axios interceptor
        setStatus('error')
        setMessage(error || 'Verification failed. The link may be expired or invalid.')
      }
    }

    verify()
  }, [searchParams, dispatch, router])

  return (
    <>
      <Breadcrumb title="Verify Account" pages={['verify account']} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue mb-5"></div>
                  <h2 className="font-bold text-dark text-2xl lg:text-3xl mb-3">
                    Verifying Your Account...
                  </h2>
                  <p className="max-w-[491px] w-full mx-auto">
                    Please wait while we verify your email address.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <svg
                    className="mx-auto mb-5"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="40" cy="40" r="40" fill="#10B981" fillOpacity="0.1" />
                    <path
                      d="M56 30L34 52L24 42"
                      stroke="#10B981"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h2 className="font-bold text-green-600 text-2xl lg:text-3xl mb-3">
                    Verification Successful!
                  </h2>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5">
                    {message}
                  </p>
                  <p className="text-dark-4">
                    Redirecting to login page in 3 seconds...
                  </p>
                  <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-5"
                  >
                    Go to Login
                  </Link>
                </>
              )}

              {status === 'error' && (
                <>
                  <svg
                    className="mx-auto mb-5"
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="40" cy="40" r="40" fill="#EF4444" fillOpacity="0.1" />
                    <path
                      d="M50 30L30 50M30 30L50 50"
                      stroke="#EF4444"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h2 className="font-bold text-red text-2xl lg:text-3xl mb-3">
                    Verification Failed
                  </h2>
                  <p className="max-w-[491px] w-full mx-auto mb-7.5">
                    {message}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/signin"
                      className="inline-flex items-center justify-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                    >
                      Back to Login
                    </Link>
                    <Link
                      href="/resend-verification"
                      className="inline-flex items-center justify-center gap-2 font-medium text-dark bg-gray-2 py-3 px-6 rounded-md ease-out duration-200 hover:bg-gray-3"
                    >
                      Resend Verification Email
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default VerifyAccount
