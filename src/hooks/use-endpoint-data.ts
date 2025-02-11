import { useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { useDashboardStore } from '@/store/dashboard'

const API_BASE_URL = '/api/endpoints' // Adjust based on your API setup

export function useEndpointData() {
  const { user } = useAuth()
  const { setCanvasLoading, setCanvasData } = useDashboardStore()

  const fetchEndpointData = useCallback(async (endpoint: string) => {
    if (!user?.accessToken) return null

    setCanvasLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch endpoint data')
      }

      const data = await response.json()
      setCanvasData(data)
      return data
    } catch (error) {
      console.error('Error fetching endpoint data:', error)
      setCanvasData(null)
      return null
    } finally {
      setCanvasLoading(false)
    }
  }, [user?.accessToken, setCanvasLoading, setCanvasData])

  return { fetchEndpointData }
}