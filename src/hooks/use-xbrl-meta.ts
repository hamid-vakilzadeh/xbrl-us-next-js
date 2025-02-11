'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { 
  fetchXBRLMeta, 
  fetchAllEndpointsMeta, 
  getStoredMeta, 
  getStoredEndpointsMeta, 
  type XBRLMeta, 
  type AllEndpointsMetadata 
} from '@/lib/api/meta'

interface UseXBRLMetaResult {
  meta: XBRLMeta | null
  endpointsMeta: AllEndpointsMetadata | null
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useXBRLMeta(): UseXBRLMetaResult {
  const { user } = useAuth()
  const [meta, setMeta] = useState<XBRLMeta | null>(null)
  const [endpointsMeta, setEndpointsMeta] = useState<AllEndpointsMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchAllMeta = useCallback(async () => {
    if (!user?.accessToken) {
      setError(new Error('No access token available'))
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      // First fetch main meta data
      const mainMeta = await fetchXBRLMeta(user.accessToken)
      setMeta(mainMeta)

      // Then fetch metadata for all endpoints
      const allEndpointsMeta = await fetchAllEndpointsMeta(user.accessToken, mainMeta)
      setEndpointsMeta(allEndpointsMeta)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch meta data'))
      // Try to fall back to stored data
      const storedMainData = getStoredMeta()
      const storedEndpointsData = getStoredEndpointsMeta()
      if (storedMainData) {
        setMeta(storedMainData)
      }
      if (storedEndpointsData) {
        setEndpointsMeta(storedEndpointsData)
      }
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken])

  // Load meta data on mount or when auth changes
  useEffect(() => {
    const storedMainData = getStoredMeta()
    const storedEndpointsData = getStoredEndpointsMeta()
    
    if (storedMainData && storedEndpointsData) {
      setMeta(storedMainData)
      setEndpointsMeta(storedEndpointsData)
      setIsLoading(false)
    } else {
      fetchAllMeta()
    }
  }, [user?.accessToken, fetchAllMeta])

  return {
    meta,
    endpointsMeta,
    isLoading,
    error,
    refetch: fetchAllMeta
  }
}