import React, { useState, useRef, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { updateProfile, changePassword, uploadAvatar, fetchProfile } from '@/redux/slices/authSlice'
import { UpdateProfileRequest, ChangePasswordRequest } from '@/types/auth.type'
import toast from 'react-hot-toast'
import Image from 'next/image'

const AccountDetails = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.authReducer)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Check if user is OAuth account (Google/Facebook) without a real password
  const isOAuthAccount = user?.typeAccount === 'GOOGLE' || user?.typeAccount === 'FACEBOOK'

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile
  } = useForm<UpdateProfileRequest>({
    defaultValues: {
      name: user?.name || '',
      address: user?.address || '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      gender: user?.gender || undefined
    }
  })

  // Sync form values khi user data thay đổi (load async, update profile, OAuth redirect)
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || undefined
      })
      setAvatarPreview(user.avatar || null)
    }
  }, [user, resetProfile])

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<ChangePasswordRequest>()

  const handleUpdateProfile: SubmitHandler<UpdateProfileRequest> = async (
    data
  ) => {
    try {
      await dispatch(updateProfile(data)).unwrap()
      toast.success('Profile updated successfully')
    } catch (error: any) {
      // Error toast handled by axios interceptor
    }
  }

  const handleChangePassword: SubmitHandler<ChangePasswordRequest> = async (
    data
  ) => {
    try {
      await dispatch(changePassword(data)).unwrap()
      toast.success('Đổi mật khẩu thành công')
      resetPassword()
      // Re-fetch profile to update typeAccount (OAuth → LOCAL) in Redux state
      // This may fail if sessions were revoked (expected behavior for password change)
      try {
        await dispatch(fetchProfile()).unwrap()
      } catch {
        // Session revoked after password change — user will be redirected to login
      }
    } catch (error: any) {
      // Error toast handled by axios interceptor
      resetPassword()
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setUploadingAvatar(true)
    try {
      await dispatch(uploadAvatar(file)).unwrap()
      toast.success('Avatar uploaded successfully')
    } catch (error: any) {
      // Error toast handled by axios interceptor
      setAvatarPreview(user?.avatar || null)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {/* Avatar Upload Section */}
      <div className='bg-white shadow-1 rounded-xl p-4 sm:p-8.5 mb-7.5'>
        <h3 className='font-medium text-lg text-dark mb-5'>Profile Picture</h3>
        <div className='flex flex-col sm:flex-row items-center gap-6'>
          <div className='relative'>
            <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-gray-3'>
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt='Avatar'
                  width={128}
                  height={128}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gray-2 flex items-center justify-center text-dark text-4xl font-bold'>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              )}
            </div>
            {uploadingAvatar && (
              <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
              </div>
            )}
          </div>
          
          <div className='flex-1 text-center sm:text-left'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleAvatarChange}
              className='hidden'
            />
            <button
              type='button'
              onClick={triggerFileInput}
              disabled={uploadingAvatar}
              className='inline-flex font-medium text-white bg-blue py-2.5 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:bg-gray-4 disabled:cursor-not-allowed'
            >
              {uploadingAvatar ? 'Uploading...' : 'Change Avatar'}
            </button>
            <p className='text-sm text-dark-4 mt-2'>
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmitProfile(handleUpdateProfile)}>
        <div className='bg-white shadow-1 rounded-xl p-4 sm:p-8.5'>
          <div className='flex flex-col gap-5 mb-5'>
            <div className='w-full'>
              <label htmlFor='name' className='block mb-2.5'>
                Full Name <span className='text-red'>*</span>
              </label>
              <input
                type='text'
                id='name'
                {...registerProfile('name', { required: 'Name is required' })}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              />
              {profileErrors.name && (
                <span className='text-red text-sm'>
                  {profileErrors.name.message}
                </span>
              )}
            </div>

            {/* Email - Read Only */}
            <div className='w-full'>
              <label htmlFor='email' className='block mb-2.5'>
                Email
              </label>
              <input
                type='email'
                id='email'
                value={user?.email || ''}
                disabled
                className='rounded-md border border-gray-3 bg-gray-2 text-dark-4 w-full py-2.5 px-5 outline-none cursor-not-allowed'
              />
              <p className='text-xs text-dark-5 mt-1'>Email không thể thay đổi</p>
            </div>

            <div className='w-full'>
              <label htmlFor='phone' className='block mb-2.5'>
                Phone Number
              </label>
              <input
                type='text'
                id='phone'
                {...registerProfile('phoneNumber')}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              />
            </div>

            <div className='w-full'>
              <label htmlFor='address' className='block mb-2.5'>
                Address
              </label>
              <input
                type='text'
                id='address'
                {...registerProfile('address')}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              />
            </div>

            {/* Date of Birth & Gender - same row */}
            <div className='flex flex-col sm:flex-row gap-5'>
              <div className='w-full sm:w-1/2'>
                <label htmlFor='dateOfBirth' className='block mb-2.5'>
                  Date of Birth
                </label>
                <input
                  type='date'
                  id='dateOfBirth'
                  {...registerProfile('dateOfBirth')}
                  className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
                />
              </div>

              <div className='w-full sm:w-1/2'>
                <label htmlFor='gender' className='block mb-2.5'>
                  Gender
                </label>
                <select
                  id='gender'
                  {...registerProfile('gender')}
                  className='rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 appearance-none'
                >
                  <option value=''>-- Select --</option>
                  <option value='male'>Nam</option>
                  <option value='female'>Nữ</option>
                  <option value='other'>Khác</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type='submit'
            className='inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark'
          >
            Save Changes
          </button>
        </div>
      </form>

      <p className='text-custom-sm mt-5 mb-9'>
        This will be how your name will be displayed in the account section and
        in reviews
      </p>

      {/* Password Form */}
      <p className='font-medium text-xl sm:text-2xl text-dark mb-7'>
        Password Change
      </p>

      <form onSubmit={handleSubmitPassword(handleChangePassword)}>
        <div className='bg-white shadow-1 rounded-xl p-4 sm:p-8.5'>
          {isOAuthAccount && (
            <div className='mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
              <div className='flex items-center gap-2'>
                <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M10 18.3334C14.6024 18.3334 18.3334 14.6024 18.3334 10C18.3334 5.39765 14.6024 1.66669 10 1.66669C5.39765 1.66669 1.66669 5.39765 1.66669 10C1.66669 14.6024 5.39765 18.3334 10 18.3334Z' stroke='#3B82F6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M10 13.3334V10' stroke='#3B82F6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                  <path d='M10 6.66669H10.0083' stroke='#3B82F6' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
                <p className='text-sm text-blue-700'>
                  Tài khoản {user?.typeAccount === 'GOOGLE' ? 'Google' : 'Facebook'} chưa có mật khẩu. Bạn có thể thiết lập mật khẩu mới bên dưới.
                </p>
              </div>
            </div>
          )}

          {!isOAuthAccount && (
          <div className='mb-5'>
            <label htmlFor='currentPassword' className='block mb-2.5'>
              Current Password
            </label>
            <div className='relative'>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id='currentPassword'
                {...registerPassword('currentPassword', { required: 'Required' })}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              />
              <button
                type='button'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark'
              >
                {showCurrentPassword ? (
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
            {passwordErrors.currentPassword && (
              <span className='text-red text-sm'>Required</span>
            )}
          </div>
          )}

          <div className='mb-5'>
            <label htmlFor='newPassword' className='block mb-2.5'>
              New Password
            </label>
            <div className='relative'>
              <input
                type={showNewPassword ? 'text' : 'password'}
                id='newPassword'
                {...registerPassword('newPassword', {
                  required: 'Required',
                  minLength: { value: 6, message: 'Min 6 chars' }
                })}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-5 hover:text-dark'
              >
                {showNewPassword ? (
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
            {passwordErrors.newPassword && (
              <span className='text-red text-sm'>
                {passwordErrors.newPassword.message}
              </span>
            )}
          </div>

          <div className='mb-5'>
            <label htmlFor='confirmPassword' className='block mb-2.5'>
              Confirm New Password
            </label>
            <div className='relative'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id='confirmPassword'
                {...registerPassword('confirmPassword', {
                  validate: (val) =>
                    val === watch('newPassword') || 'Passwords do not match'
                })}
                className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 pr-12 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
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
            {passwordErrors.confirmPassword && (
              <span className='text-red text-sm'>
                {passwordErrors.confirmPassword.message}
              </span>
            )}
          </div>

          <button
            type='submit'
            className='inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark'
          >
            Change Password
          </button>
        </div>
      </form>
    </>
  )
}

export default AccountDetails
