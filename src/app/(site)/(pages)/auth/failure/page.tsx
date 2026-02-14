'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuthFailurePage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState('Authentication failed')

  useEffect(() => {
    // Get error message from query parameters if provided
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    if (message) {
      setErrorMessage(decodeURIComponent(message))
    } else if (error) {
      // Map common error codes to user-friendly messages
      const errorMessages: { [key: string]: string } = {
        access_denied: 'You denied access to your account',
        server_error: 'An unexpected error occurred on the server',
        temporarily_unavailable: 'The service is temporarily unavailable',
        invalid_request: 'Invalid authentication request',
        unauthorized_client: 'This application is not authorized',
        unsupported_response_type: 'Unsupported authentication method',
        invalid_scope: 'Invalid permission scope requested',
        account_exists: 'An account with this email already exists',
      }

      setErrorMessage(
        errorMessages[error] || 'Authentication failed. Please try again.'
      )
    }
  }, [searchParams])

  return (
    <section className='py-20 lg:py-25 xl:py-30'>
      <div className='mx-auto max-w-[570px] px-4 sm:px-8 xl:px-0'>
        <div className='rounded-xl bg-white shadow-1 py-12 px-7.5 sm:px-12.5'>
          <div className='text-center'>
            {/* Error Icon */}
            <div className='mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-red-100'>
              <svg
                className='fill-red-500'
                width='40'
                height='40'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M20 3.125C10.6802 3.125 3.125 10.6802 3.125 20C3.125 29.3198 10.6802 36.875 20 36.875C29.3198 36.875 36.875 29.3198 36.875 20C36.875 10.6802 29.3198 3.125 20 3.125ZM15.8839 13.7411C15.2902 13.1474 14.3348 13.1474 13.7411 13.7411C13.1474 14.3348 13.1474 15.2902 13.7411 15.8839L17.8571 20L13.7411 24.1161C13.1474 24.7098 13.1474 25.6652 13.7411 26.2589C14.3348 26.8526 15.2902 26.8526 15.8839 26.2589L20 22.1429L24.1161 26.2589C24.7098 26.8526 25.6652 26.8526 26.2589 26.2589C26.8526 25.6652 26.8526 24.7098 26.2589 24.1161L22.1429 20L26.2589 15.8839C26.8526 15.2902 26.8526 14.3348 26.2589 13.7411C25.6652 13.1474 24.7098 13.1474 24.1161 13.7411L20 17.8571L15.8839 13.7411Z'
                  fill=''
                />
              </svg>
            </div>

            <h2 className='text-2xl font-semibold text-dark mb-3'>
              Authentication Failed
            </h2>

            <p className='text-custom-sm text-dark-4 mb-2'>{errorMessage}</p>

            <p className='text-xs text-dark-5 mb-8'>
              If this problem persists, please contact support.
            </p>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                href='/signin'
                className='inline-flex items-center justify-center gap-2.5 rounded-md bg-blue px-6 py-3 font-medium text-white ease-out duration-200 hover:bg-blue-dark'
              >
                <svg
                  className='fill-current'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M7.70711 3.29289C8.09763 3.68342 8.09763 4.31658 7.70711 4.70711L4.41421 8H14C14.5523 8 15 8.44772 15 9C15 9.55228 14.5523 10 14 10H4.41421L7.70711 13.2929C8.09763 13.6834 8.09763 14.3166 7.70711 14.7071C7.31658 15.0976 6.68342 15.0976 6.29289 14.7071L1.29289 9.70711C0.902369 9.31658 0.902369 8.68342 1.29289 8.29289L6.29289 3.29289C6.68342 2.90237 7.31658 2.90237 7.70711 3.29289Z'
                    fill=''
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M9 2C9 1.44772 9.44772 1 10 1H16C17.6569 1 19 2.34315 19 4V16C19 17.6569 17.6569 19 16 19H10C9.44772 19 9 18.5523 9 18C9 17.4477 9.44772 17 10 17H16C16.5523 17 17 16.5523 17 16V4C17 3.44772 16.5523 3 16 3H10C9.44772 3 9 2.55228 9 2Z'
                    fill=''
                  />
                </svg>
                Back to Sign In
              </Link>

              <Link
                href='/'
                className='inline-flex items-center justify-center gap-2.5 rounded-md border border-gray-3 bg-gray-1 px-6 py-3 font-medium text-dark ease-out duration-200 hover:bg-gray-2'
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
