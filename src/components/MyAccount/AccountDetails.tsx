import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { updateProfile, changePassword } from '@/redux/slices/authSlice'
import { UpdateProfileRequest, ChangePasswordRequest } from '@/types/auth.type'
import { toast } from 'react-hot-toast'

const AccountDetails = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.authReducer)

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors }
  } = useForm<UpdateProfileRequest>({
    defaultValues: {
      name: user?.name || '',
      address: user?.address || '',
      phone: user?.phone || ''
    }
  })

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
      toast.error(error || 'Failed to update profile')
    }
  }

  const handleChangePassword: SubmitHandler<ChangePasswordRequest> = async (
    data
  ) => {
    try {
      await dispatch(changePassword(data)).unwrap()
      toast.success('Password changed successfully')
      resetPassword()
    } catch (error: any) {
      toast.error(error || 'Failed to change password')
    }
  }

  return (
    <>
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

            <div className='w-full'>
              <label htmlFor='phone' className='block mb-2.5'>
                Phone Number
              </label>
              <input
                type='text'
                id='phone'
                {...registerProfile('phone')}
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
          <div className='mb-5'>
            <label htmlFor='currentPassword' className='block mb-2.5'>
              Current Password
            </label>
            <input
              type='password'
              id='currentPassword'
              {...registerPassword('currentPassword', { required: 'Required' })}
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            />
            {passwordErrors.currentPassword && (
              <span className='text-red text-sm'>Required</span>
            )}
          </div>

          <div className='mb-5'>
            <label htmlFor='newPassword' className='block mb-2.5'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              {...registerPassword('newPassword', {
                required: 'Required',
                minLength: { value: 6, message: 'Min 6 chars' }
              })}
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            />
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
            <input
              type='password'
              id='confirmPassword'
              {...registerPassword('confirmPassword', {
                validate: (val) =>
                  val === watch('newPassword') || 'Passwords do not match'
              })}
              className='rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20'
            />
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
