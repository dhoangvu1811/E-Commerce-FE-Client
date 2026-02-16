'use client'

import { useEffect, useState, useRef } from 'react'

import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'

import { useAppDispatch } from '@/redux/store'
import { fetchProfile } from '@/redux/slices/authSlice'

export default function AuthSuccessPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [_isLoading, setIsLoading] = useState(true)
  const hasRun = useRef(false)

  useEffect(() => {
    // Guard against React StrictMode double-execution
    if (hasRun.current) return
    hasRun.current = true

    const fetchUserAfterOAuth = async () => {
      try {
        // Fetch user profile to update Redux state after OAuth login
        await dispatch(fetchProfile()).unwrap()
        
        // Show success message
        toast.success('Đăng nhập thành công! Đang chuyển hướng...')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/my-account')
        }, 2000)
      } catch (error: any) {
        // If profile fetch fails, redirect to login
        toast.error('Xác thực thất bại. Vui lòng thử lại.')
        setTimeout(() => {
          router.push('/signin')
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAfterOAuth()
  }, [router, dispatch])

  return (
    <section className='py-20 lg:py-25 xl:py-30'>
      <div className='mx-auto max-w-[570px] px-4 sm:px-8 xl:px-0'>
        <div className='rounded-xl bg-white shadow-1 py-12 px-7.5 sm:px-12.5'>
          <div className='text-center'>
            {/* Success Icon */}
            <div className='mx-auto w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-green-100'>
              <svg
                className='fill-green-500'
                width='40'
                height='40'
                viewBox='0 0 40 40'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  clipRule='evenodd'
                  d='M20 3.125C10.6802 3.125 3.125 10.6802 3.125 20C3.125 29.3198 10.6802 36.875 20 36.875C29.3198 36.875 36.875 29.3198 36.875 20C36.875 10.6802 29.3198 3.125 20 3.125ZM27.8839 15.8839C28.4776 15.2902 28.4776 14.3348 27.8839 13.7411C27.2902 13.1474 26.3348 13.1474 25.7411 13.7411L17.5 21.9822L14.2589 18.7411C13.6652 18.1474 12.7098 18.1474 12.1161 18.7411C11.5224 19.3348 11.5224 20.2902 12.1161 20.8839L16.4286 25.1964C17.0223 25.7901 17.9777 25.7901 18.5714 25.1964L27.8839 15.8839Z'
                  fill=''
                />
              </svg>
            </div>

            <h2 className='text-2xl font-semibold text-dark mb-3'>
              Authentication Successful!
            </h2>

            <p className='text-custom-sm text-dark-4 mb-8'>
              You have successfully logged in. Redirecting you to your account
              dashboard...
            </p>

            {/* Loading Spinner */}
            <div className='flex justify-center'>
              <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-blue'></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
