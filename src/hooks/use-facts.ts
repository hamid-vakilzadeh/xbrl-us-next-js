import { useState, useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { searchFacts, getFactById, type FactSearchParams, type FactResponse } from '@/lib/api/facts'

interface UseFactsResult {
  isLoading: boolean
  error: Error | null
  data: FactResponse | null
  search: (params: Omit<FactSearchParams, 'endpoint'> & { endpoint?: FactSearchParams['endpoint'] }) => Promise<void>
  getById: (id: string | number) => Promise<any>
}

export function useFacts(): UseFactsResult {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<FactResponse | null>(null)

  const search = useCallback(async ({ endpoint = 'fact/search', ...params }: Omit<FactSearchParams, 'endpoint'> & { endpoint?: FactSearchParams['endpoint'] }) => {
    if (!user?.accessToken) {
      setError(new Error('No access token available'))
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await searchFacts(user.accessToken, { endpoint, ...params })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search facts'))
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken])

  const getById = useCallback(async (id: string | number) => {
    if (!user?.accessToken) {
      throw new Error('No access token available')
    }

    setIsLoading(true)
    setError(null)
    try {
      const result = await getFactById(user.accessToken, id)
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to get fact ${id}`))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [user?.accessToken])

  return {
    isLoading,
    error,
    data,
    search,
    getById
  }
}