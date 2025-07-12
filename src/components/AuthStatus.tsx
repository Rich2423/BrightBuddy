'use client'

import React from 'react'
import { useAuth } from '../utils/AuthContext'

export default function AuthStatus() {
  const { user, isEmailVerified, loading } = useAuth()

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-800">Checking authentication...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-yellow-600">⚠</span>
          <div>
            <p className="text-yellow-800 font-medium">Authentication Required</p>
            <p className="text-yellow-700 text-sm">Please sign in to access all features</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isEmailVerified) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-orange-600">⚠</span>
          <div>
            <p className="text-orange-800 font-medium">Email Verification Required</p>
            <p className="text-orange-700 text-sm">
              Please check your email and click the verification link to unlock all features
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-green-600">✓</span>
        <div>
          <p className="text-green-800 font-medium">Authenticated</p>
          <p className="text-green-700 text-sm">Welcome back, {user.email}</p>
        </div>
      </div>
    </div>
  )
} 