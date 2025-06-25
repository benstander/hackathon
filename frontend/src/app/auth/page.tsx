'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '../../components/login-form'
import { SignupForm } from '../../components/signup-form'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const [isLogin, setIsLogin] = useState(mode !== 'signup')
  const { user, loading } = useAuth()
  const router = useRouter()

  // Update form mode when URL parameter changes
  useEffect(() => {
    setIsLogin(mode !== 'signup')
  }, [mode])

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  // Show loading while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  // Don't render anything if user is logged in (will redirect)
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Get started with your financial journey'
            }
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}