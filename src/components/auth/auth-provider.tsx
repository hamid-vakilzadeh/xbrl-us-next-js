'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { refreshXBRLToken } from '@/api/auth'

interface XBRLUser {
  email: string
  accessToken: string
  refreshToken: string
  tokenExpiry: number
  clientId: string
  clientSecret: string
}

interface AuthContextType {
  user: XBRLUser | null
  signIn: (email: string, accessToken: string, refreshToken: string, tokenExpiry: number, clientId: string, clientSecret: string) => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'xbrl_auth_state'
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<XBRLUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const signOut = useCallback(async () => {
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem('xbrl_access_token')
    localStorage.removeItem('xbrl_refresh_token')
    localStorage.removeItem('xbrl_token_expiry')
  }, [])

  const refreshAuth = useCallback(async () => {
    if (!user?.refreshToken) return

    try {
      const newTokens = await refreshXBRLToken(
        user.refreshToken,
        user.clientId,
        user.clientSecret,
        user.email
      )
      const updatedAuth = {
        ...user,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
        tokenExpiry: Date.now() + newTokens.expires_in * 1000
      }
      setUser(updatedAuth)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth))
    } catch (error) {
      // If refresh fails, sign out
      await signOut()
    }
  }, [user, signOut])

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
        if (savedAuth) {
          const authData = JSON.parse(savedAuth)
          // Check if token needs refresh
          if (authData.tokenExpiry - Date.now() < TOKEN_REFRESH_THRESHOLD) {
            if (authData.refreshToken) {
              try {
                const newTokens = await refreshXBRLToken(
                  authData.refreshToken,
                  authData.clientId,
                  authData.clientSecret,
                  authData.email
                )
                const updatedAuth = {
                  ...authData,
                  accessToken: newTokens.access_token,
                  refreshToken: newTokens.refresh_token,
                  tokenExpiry: Date.now() + newTokens.expires_in * 1000
                }
                setUser(updatedAuth)
                localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedAuth))
              } catch (error) {
                // If refresh fails, sign out
                await signOut()
              }
            }
          } else if (authData.tokenExpiry > Date.now()) {
            setUser(authData)
          } else {
            // Clean up expired auth state
            await signOut()
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthState()
  }, [signOut])

  // Set up periodic token refresh
  useEffect(() => {
    if (!user) return

    const timeUntilRefresh = user.tokenExpiry - Date.now() - TOKEN_REFRESH_THRESHOLD
    if (timeUntilRefresh <= 0) return

    const refreshTimeout = setTimeout(refreshAuth, timeUntilRefresh)
    return () => clearTimeout(refreshTimeout)
  }, [user, refreshAuth])

  const signIn = async (
    email: string, 
    accessToken: string, 
    refreshToken: string, 
    tokenExpiry: number,
    clientId: string,
    clientSecret: string
  ) => {
    const userData: XBRLUser = {
      email,
      accessToken,
      refreshToken,
      tokenExpiry,
      clientId,
      clientSecret
    }
    setUser(userData)
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signOut,
      isAuthenticated: user !== null,
      isLoading,
      refreshAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}