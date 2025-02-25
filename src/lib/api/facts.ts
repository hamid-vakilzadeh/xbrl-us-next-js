import { XBRLMeta } from './meta'
import { useQuery } from '@tanstack/react-query'

interface FactSearchParams {
  endpoint: 'fact/search' | 'fact/oim/search'
  fields?: string[]
  filters: Record<string, string | number | boolean | Array<string | number>>
}

interface FactResponse {
  data: any[] // Will be typed based on the fields requested
  pagination?: {
    total: number
    page: number
    perPage: number
  }
}


export async function searchFacts(
  accessToken: string,
  { endpoint, fields = ['fact.*'], filters }: FactSearchParams
): Promise<FactResponse> {
  // Build query string
  const params = new URLSearchParams()
  
  // Add fields
  params.append('fields', fields.join(','))
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','))
    } else {
      params.append(key, String(value))
    }
  })

  const response = await fetch(`https://api.xbrl.us/api/v1/${endpoint}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch facts: ${response.statusText}`)
  }

  return await response.json() as FactResponse
}

export async function getFactById(accessToken: string, factId: string | number): Promise<any> {
  const response = await fetch(`https://api.xbrl.us/api/v1/fact/${factId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch fact ${factId}: ${response.statusText}`)
  }

  return await response.json()
}

export function useSearchFacts(
  accessToken: string, 
  params: FactSearchParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['facts', 'search', params],
    queryFn: () => searchFacts(accessToken, params),
    enabled: !!accessToken && (options?.enabled ?? true),
  })
}

export function useFactById(accessToken: string, factId: string | number) {
  return useQuery({
    queryKey: ['facts', 'byId', factId],
    queryFn: () => getFactById(accessToken, factId),
    enabled: !!accessToken && !!factId,
  })
}

export type { FactSearchParams, FactResponse }
