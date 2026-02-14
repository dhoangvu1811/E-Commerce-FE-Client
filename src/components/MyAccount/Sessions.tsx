/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { fetchMySessions, revokeMySession } from '@/redux/slices/authSlice'
import { SessionInfo } from '@/types/auth.type'
import toast from 'react-hot-toast'

const Sessions = () => {
  const dispatch = useAppDispatch()
  const [sessions, setSessions] = React.useState<SessionInfo[]>([])
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const result = await dispatch(fetchMySessions()).unwrap()
      setSessions(result.sessions || [])
    } catch (error: any) {
      // Error toast handled by axios interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to logout this device?')) return

    try {
      await dispatch(revokeMySession({ sessionId })).unwrap()
      toast.success('Session revoked successfully')
      // Refresh sessions list
      await loadSessions()
    } catch (error: any) {
      // Error toast handled by axios interceptor
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceIcon = (deviceInfo: string) => {
    const info = deviceInfo.toLowerCase()
    if (info.includes('iphone') || info.includes('android')) {
      return (
        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 2h10a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2zm5 13a1 1 0 100 2 1 1 0 000-2z"/>
        </svg>
      )
    }
    return (
      <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 11h12v1a1 1 0 01-1 1H5a1 1 0 01-1-1v-1z"/>
      </svg>
    )
  }

  if (loading) {
    return (
      <div className="bg-white shadow-1 rounded-xl p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
        <p className="mt-4">Loading sessions...</p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-1 rounded-xl p-4 sm:p-8.5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-lg text-dark">Active Sessions</h3>
        <button
          onClick={loadSessions}
          className="text-blue hover:text-blue-dark text-sm flex items-center gap-1"
        >
          <svg className="fill-current" width="16" height="16" viewBox="0 0 16 16">
            <path d="M13.65 2.35A8 8 0 102.35 13.65 8 8 0 0013.65 2.35zm-1.41 1.41A6 6 0 113.76 12.24 6 6 0 0112.24 3.76z"/>
            <path d="M8 4v4l3 3"/>
          </svg>
          Refresh
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-dark-4">No active sessions found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className="border border-gray-3 rounded-lg p-4 hover:border-blue transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-dark-4 mt-1">
                    {getDeviceIcon(session.deviceInfo)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-dark">
                        {session.deviceInfo.includes('Chrome') ? 'Chrome Browser' :
                         session.deviceInfo.includes('Safari') ? 'Safari Browser' :
                         session.deviceInfo.includes('Firefox') ? 'Firefox Browser' :
                         session.deviceInfo.includes('Edge') ? 'Edge Browser' : 'Web Browser'}
                      </h4>
                      {session.isCurrent && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                          Current Device
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-dark-4 mb-1">
                      {session.deviceInfo.length > 80 
                        ? session.deviceInfo.substring(0, 80) + '...' 
                        : session.deviceInfo}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark-4">
                      <span>IP: {session.ipAddress}</span>
                      <span>Signed in: {formatDate(session.createdAt)}</span>
                      <span>Expires: {formatDate(session.expiresAt)}</span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.sessionId)}
                    className="text-red hover:text-red-dark text-sm font-medium whitespace-nowrap"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-1 rounded-lg">
        <h4 className="font-medium text-dark mb-2 flex items-center gap-2">
          <svg className="fill-current text-blue" width="18" height="18" viewBox="0 0 18 18">
            <path d="M9 1a8 8 0 100 16A8 8 0 009 1zm0 3a1 1 0 011 1v4a1 1 0 11-2 0V5a1 1 0 011-1zm0 8a1 1 0 100 2 1 1 0 000-2z"/>
          </svg>
          Security Information
        </h4>
        <p className="text-sm text-dark-4">
          These are devices that are currently logged into your account. 
          If you don't recognize a device, you can log it out to protect your account.
          Note: It may take up to 5 minutes for the device to be logged out.
        </p>
      </div>
    </div>
  )
}

export default Sessions
