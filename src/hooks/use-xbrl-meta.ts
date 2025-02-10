'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { fetchXBRLMeta, getStoredMeta, type XBRLMeta } from '@/lib/api/meta'

interface UseXBRLMetaResult {
  meta: XBRLMeta | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useXBRLMeta(): UseXBRLMetaResult {
  const { user } = useAuth()
  const [meta, setMeta] = useState<XBRLMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMeta = useCallback(async () => {
    if (!user?.accessToken) {
      setError(new Error('No access token available'))
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await fetchXBRLMeta(user.accessToken)
      setMeta(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch meta data'))
      // Try to fall back to stored data
      const storedData = getStoredMeta()
      if (storedData) {
        setMeta(storedData)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken])

  // Load meta data on mount or when auth changes
  useEffect(() => {
    const storedData = getStoredMeta()
    if (storedData) {
      setMeta(storedData)
      setIsLoading(false)
    } else {
      fetchMeta()
    }
  }, [user?.accessToken, fetchMeta])

  return {
    meta,
    isLoading,
    error,
    refetch: fetchMeta
  }
}