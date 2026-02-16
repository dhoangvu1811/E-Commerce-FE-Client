/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react'

import Link from 'next/link'

import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form'

import toast from 'react-hot-toast'

import { useAppDispatch } from '@/redux/store'
import { sendVerificationEmail } from '@/redux/slices/authSlice'
import Breadcrumb from '@/components/Common/Breadcrumb'

interface ResendForm {
  email: string
}

const ResendVerification = () => {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResendForm>()

  const onSubmit: SubmitHandler<ResendForm> = async (data) => {
    setLoading(true)
    setSuccess(false)
    
    try {
      await dispatch(sendVerificationEmail({ email: data.email })).unwrap()
      toast.success('Verification email sent successfully! Please check your inbox.')
      setSuccess(true)
    } catch (error: any) {
      // Error toast handled by axios interceptor
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Breadcrumb title="Resend Verification" pages={['resend verification']} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            {!success ? (
              <>
                <div className="text-center mb-11">
                  <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                    Resend Verification Email
                  </h2>
                  <p>Enter your email address to receive a new verification link</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-5">
                    <label htmlFor="email" className="block mb-2.5">
                      Email Address <span className="text-red">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                    {errors.email && (
                      <span className="text-red text-sm">{errors.email.message}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue disabled:bg-gray-4 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Verification Email'}
                  </button>

                  <p className="text-center mt-6">
                    Remember your password?
                    <Link
                      href="/signin"
                      className="text-dark ease-out duration-200 hover:text-blue pl-2"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center">
                <svg
                  className="mx-auto mb-5"
                  width="80"
                  height="80"
                  viewBox="0 0 80 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="40" cy="40" r="40" fill="#3C50E0" fillOpacity="0.1" />
                  <path
                    d="M23 40L33 50L57 26"
                    stroke="#3C50E0"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h2 className="font-bold text-blue text-2xl mb-3">
                  Email Sent!
                </h2>
                <p className="max-w-[400px] mx-auto mb-7.5">
                  We've sent a verification link to your email address. 
                  Please check your inbox and click the link to verify your account.
                </p>
                <p className="text-sm text-dark-4 mb-5">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark"
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ResendVerification
