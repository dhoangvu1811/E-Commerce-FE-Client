'use client'
import Breadcrumb from '@/components/Common/Breadcrumb'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { register as registerUser, clearAuth } from '@/redux/slices/authSlice' // renamed to avoid conflict with hook form
import { RegisterRequest } from '@/types/auth.type'
import toast from 'react-hot-toast'

const Signup = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.authReducer)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<RegisterRequest>()

  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap()
      toast.success(
        'Account created successfully! Please check your email to verify your account.',
        { duration: 5000 }
      )
      router.push('/resend-verification')
    } catch (error: any) {
      // Error toast handled by axios interceptor
      reset()
    }
  }

  // OAuth handlers
  const handleGoogleLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8017/V1'
    window.location.href = `${baseUrl}/users/auth/google`
  }

  const handleFacebookLogin = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8017/V1'
    window.location.href = `${baseUrl}/users/auth/facebook`
  }

  const password = watch('password')

  return (
    <>
      <Breadcrumb title={'Signup'} pages={['Signup']} />
      <section className='overflow-hidden py-20 bg-gray-2'>
        <div className='max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0'>
          <div className='max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11'>
            <div className='text-center mb-11'>
              <h2 className='font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5'>
                Create an Account
              </h2>
              <p>Enter your detail below</p>
            </div>

            <div className='flex flex-col gap-4.5'>
              <button
                type='button'
                onClick={handleGoogleLogin}
                className='flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g clipPath='url(#clip0_98_7461)'>
                    <mask
                      id='mask0_98_7461'
                      maskUnits='userSpaceOnUse'
                      x='0'
                      y='0'
                      width='20'
                      height='20'
                    >
                      <path d='M20 0H0V20H20V0Z' fill='white' />
                    </mask>
                    <g mask='url(#mask0_98_7461)'>
                      <path
                        d='M19.999 10.2218C20.0111 9.53429 19.9387 8.84791 19.7834 8.17737H10.2031V11.8884H15.8267C15.7201 12.5391 15.4804 13.162 15.1219 13.7195C14.7634 14.2771 14.2935 14.7578 13.7405 15.1328L13.7209 15.2571L16.7502 17.5568L16.96 17.5774C18.8873 15.8329 19.999 13.2661 19.999 10.2218Z'
                        fill='#4285F4'
                      />
                      <path
                        d='M10.2036 20C12.9586 20 15.2715 19.1111 16.9609 17.5777L13.7409 15.1332C12.8793 15.7223 11.7229 16.1333 10.2036 16.1333C8.91317 16.126 7.65795 15.7206 6.61596 14.9746C5.57397 14.2287 4.79811 13.1802 4.39848 11.9777L4.2789 11.9877L1.12906 14.3766L1.08789 14.4888C1.93622 16.1457 3.23812 17.5386 4.84801 18.512C6.45791 19.4852 8.31194 20.0005 10.2036 20Z'
                        fill='#34A853'
                      />
                      <path
                        d='M4.39899 11.9776C4.1758 11.3411 4.06063 10.673 4.05807 9.9999C4.06218 9.3279 4.1731 8.66067 4.38684 8.02221L4.38115 7.88959L1.1927 5.46234L1.0884 5.51095C0.372762 6.90337 0 8.44075 0 9.99983C0 11.5589 0.372762 13.0962 1.0884 14.4887L4.39899 11.9776Z'
                        fill='#FBBC05'
                      />
                      <path
                        d='M10.2039 3.86663C11.6661 3.84438 13.0802 4.37803 14.1495 5.35558L17.0294 2.59997C15.1823 0.90185 12.7364 -0.0298855 10.2039 -3.67839e-05C8.31239 -0.000477835 6.45795 0.514733 4.84805 1.48799C3.23816 2.46123 1.93624 3.85417 1.08789 5.51101L4.38751 8.02225C4.79107 6.82005 5.5695 5.77231 6.61303 5.02675C7.65655 4.28119 8.91254 3.87541 10.2039 3.86663Z'
                        fill='#EB4335'
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id='clip0_98_7461'>
                      <rect width='20' height='20' fill='white' />
                    </clipPath>
                  </defs>
                </svg>
                Sign Up with Google
              </button>

              <button
                type='button'
                onClick={handleFacebookLogin}
                className='flex justify-center items-center gap-3.5 rounded-lg border border-gray-3 bg-gray-1 p-3 ease-out duration-200 hover:bg-gray-2'
              >
                <svg
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z'
                    fill='#1877F2'
                  />
                </svg>
                Sign Up with Facebook
              </button>
            </div>

            <span className='relative z-1 block font-medium text-center mt-4.5'>
              <span className='block absolute -z-1 left-0 top-1/2 h-px w-full bg-gray-3'></span>
              <span className='inline-block px-3 bg-white'>Or</span>
            </span>

            <div className='mt-5.5'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-5'>
                  <label htmlFor='name' className='block mb-2.5'>
                    Full Name <span className='text-red'>*</span>
                  </label>

                  <input
                    type='text'
                    id='name'
                    placeholder='Enter your full name'
                    {...register('name', { required: true })}
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                  />
                  {errors.name && (
                    <span className='text-red'>Name is required</span>
                  )}
                </div>

                <div className='mb-5'>
                  <label htmlFor='email' className='block mb-2.5'>
                    Email Address <span className='text-red'>*</span>
                  </label>

                  <input
                    type='email'
                    id='email'
                    placeholder='Enter your email address'
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                  />
                  {errors.email && (
                    <span className='text-red text-sm'>{errors.email.message}</span>
                  )}
                </div>

                <div className='mb-5'>
                  <label htmlFor='password' className='block mb-2.5'>
                    Password <span className='text-red'>*</span>
                  </label>

                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      placeholder='Enter your password'
                      autoComplete='on'
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                          message: 'Password must contain uppercase, lowercase, and number'
                        }
                      })}
                      className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 pr-12 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark'
                    >
                      {showPassword ? (
                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M12.9833 10C12.9833 11.6499 11.6499 12.9833 10 12.9833C8.35009 12.9833 7.01666 11.6499 7.01666 10C7.01666 8.35009 8.35009 7.01666 10 7.01666C11.6499 7.01666 12.9833 8.35009 12.9833 10Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                      ) : (
                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M12.1083 7.89166L7.89166 12.1083C7.34999 11.5667 7.01666 10.825 7.01666 10C7.01666 8.35 8.34999 7.01666 9.99999 7.01666C10.825 7.01666 11.5667 7.35 12.1083 7.89166Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M14.8417 4.80835C13.4917 3.71669 11.7833 3.10002 10 3.10002C7.05833 3.10002 4.31667 4.83335 2.40833 7.83335C1.65833 9.00835 1.65833 10.9834 2.40833 12.1584C3.06667 13.2 3.83333 14.0917 4.66667 14.8084' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M7.01666 16.275C7.96666 16.675 8.97499 16.8917 9.99999 16.8917C12.9417 16.8917 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00835 17.5917 7.83335C17.3167 7.40002 17.0167 6.99169 16.7083 6.60835' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M12.925 10.5833C12.7083 11.7583 11.75 12.7167 10.575 12.9333' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M7.89167 12.1083L1.66667 18.3333' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M18.3333 1.66669L12.1083 7.89169' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className='text-red text-sm'>{errors.password.message}</span>
                  )}
                </div>

                <div className='mb-5.5'>
                  <label htmlFor='confirmPassword' className='block mb-2.5'>
                    Re-type Password <span className='text-red'>*</span>
                  </label>

                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id='confirmPassword'
                      placeholder='Re-type your password'
                      autoComplete='on'
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match'
                      })}
                      className='rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 pr-12 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark'
                    >
                      {showConfirmPassword ? (
                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M12.9833 10C12.9833 11.6499 11.6499 12.9833 10 12.9833C8.35009 12.9833 7.01666 11.6499 7.01666 10C7.01666 8.35009 8.35009 7.01666 10 7.01666C11.6499 7.01666 12.9833 8.35009 12.9833 10Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                      ) : (
                        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M12.1083 7.89166L7.89166 12.1083C7.34999 11.5667 7.01666 10.825 7.01666 10C7.01666 8.35 8.34999 7.01666 9.99999 7.01666C10.825 7.01666 11.5667 7.35 12.1083 7.89166Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M14.8417 4.80835C13.4917 3.71669 11.7833 3.10002 10 3.10002C7.05833 3.10002 4.31667 4.83335 2.40833 7.83335C1.65833 9.00835 1.65833 10.9834 2.40833 12.1584C3.06667 13.2 3.83333 14.0917 4.66667 14.8084' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M7.01666 16.275C7.96666 16.675 8.97499 16.8917 9.99999 16.8917C12.9417 16.8917 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00835 17.5917 7.83335C17.3167 7.40002 17.0167 6.99169 16.7083 6.60835' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M12.925 10.5833C12.7083 11.7583 11.75 12.7167 10.575 12.9333' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M7.89167 12.1083L1.66667 18.3333' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                          <path d='M18.3333 1.66669L12.1083 7.89169' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className='text-red text-sm'>{errors.confirmPassword.message}</span>
                  )}
                </div>

                <button
                  type='submit'
                  className='w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5'
                >
                  Create Account
                </button>

                <p className='text-center mt-6'>
                  Already have an account?
                  <Link
                    href='/signin'
                    className='text-dark ease-out duration-200 hover:text-blue pl-2'
                  >
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Signup
