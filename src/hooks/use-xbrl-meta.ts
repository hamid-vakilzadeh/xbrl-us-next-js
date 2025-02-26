'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { 
  useXBRLMeta as useXBRLMetaQuery,
  useAllEndpointsMeta,
  type XBRLMeta, 
  type AllEndpointsMetadata 
} from '@/api/meta'

export function useXBRLMeta() {
  const { user } = useAuth()
  const accessToken = user?.accessToken || ''
  
  // Use the React Query hooks from our meta API
  const { 
    data: meta,
    isLoading: isLoadingMeta,
    error: metaError,
    refetch: refetchMeta
  } = useXBRLMetaQuery(accessToken)
  
  const {
    data: endpointsMeta,
    isLoading: isLoadingEndpoints,
    error: endpointsError,
    refetch: refetchEndpoints
  } = useAllEndpointsMeta(accessToken, meta)
  
  // Combined refetch function
  const refetch = async () => {
    await refetchMeta()
    if (meta) {
      await refetchEndpoints()
    }
  }
  
  return {
    meta: meta || null,
    endpointsMeta: endpointsMeta || null,
    isLoading: isLoadingMeta || isLoadingEndpoints,
    error: metaError || endpointsError,
    refetch
  }
}