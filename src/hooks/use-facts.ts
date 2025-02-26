import { useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { 
  searchFacts, 
  getFactById, 
  useSearchFacts,
  useFactById,
  type FactSearchParams, 
  type FactResponse 
} from '@/api/facts'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useFacts() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Mutation for searching facts
  const searchFactsMutation = useMutation({
    mutationFn: async (params: Omit<FactSearchParams, 'endpoint'> & { endpoint?: FactSearchParams['endpoint'] }) => {
      if (!user?.accessToken) {
        throw new Error('No access token available')
      }
      const endpoint = params.endpoint || 'fact/search'
      return searchFacts(user.accessToken, { endpoint, ...params })
    },
    // Optionally invalidate relevant queries after mutation
    onSuccess: () => {
      // You can invalidate specific queries if needed
      // queryClient.invalidateQueries({ queryKey: ['facts'] })
    }
  })

  // Mutation for getting fact by ID
  const getFactByIdMutation = useMutation({
    mutationFn: async (id: string | number) => {
      if (!user?.accessToken) {
        throw new Error('No access token available')
      }
      return getFactById(user.accessToken, id)
    }
  })
  
  // Helper function that maintains the same API as before
  const search = useCallback(async (params: Omit<FactSearchParams, 'endpoint'> & { endpoint?: FactSearchParams['endpoint'] }) => {
    return searchFactsMutation.mutateAsync(params)
  }, [searchFactsMutation])
  
  const getById = useCallback(async (id: string | number) => {
    return getFactByIdMutation.mutateAsync(id)
  }, [getFactByIdMutation])

  return {
    isLoading: searchFactsMutation.isPending || getFactByIdMutation.isPending,
    error: searchFactsMutation.error || getFactByIdMutation.error,
    data: searchFactsMutation.data,
    search,
    getById,
    // Also expose the React Query hooks directly for more complex use cases
    useSearchFacts: (params: FactSearchParams) => useSearchFacts(user?.accessToken || '', params),
    useFactById: (id: string | number) => useFactById(user?.accessToken || '', id)
  }
}