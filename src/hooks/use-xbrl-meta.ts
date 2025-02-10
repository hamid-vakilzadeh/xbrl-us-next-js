'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { fetchXBRLMeta, getStoredMeta, type XBRLMeta } from '@/lib/api/meta'

export function useXBRLMeta() {
  const { user } = useAuth()
  const [meta, setMeta] = useState<XBRLMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadMeta() {
      // First try to get from localStorage
      const storedMeta = getStoredMeta()
      if (storedMeta) {
        setMeta(storedMeta)
        setIsLoading(false)
        return
      }

      // If not in storage and we have an access token, fetch it
      if (user?.accessToken) {
        try {
          const fetchedMeta = await fetchXBRLMeta(user.accessToken)
          setMeta(fetchedMeta)
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to fetch meta data'))
        }
      }
      
      setIsLoading(false)
    }

    loadMeta()
  }, [user?.accessToken])

  const refreshMeta = async () => {
    if (!user?.accessToken) {
      setError(new Error('No access token available'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const fetchedMeta = await fetchXBRLMeta(user.accessToken)
      setMeta(fetchedMeta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch meta data'))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    meta,
    isLoading,
    error,
    refreshMeta
  }
}