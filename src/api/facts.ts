import { XBRLMeta } from './meta'
import { useQuery } from '@tanstack/react-query'
import { FactDimension, FactData} from '@/types/xbrl-us-types'
interface FactSearchParams {
  endpoint: 'fact/search' | 'fact/oim/search'
  fields?: string[]
  filters: Record<string, string | number | boolean | Array<string | number>>
  limit?: number
  offset?: number
  wait?: number
}


interface FactResponse {
  data: FactData[]
  paging: {
    limit: number
    offset: number
    count: number
  }
  cached_time?: number  // Changed from int to number
}

interface UserLimitError {
  error: string;
  error_description: string;
  userLimit?: number;
}

export async function searchFacts(
  accessToken: string,
  { endpoint, fields = ['fact.*'], filters, limit = 100, offset = 0, wait = 1000 }: FactSearchParams,
  signal?: AbortSignal
): Promise<FactResponse> {
  // Build query string
  const params = new URLSearchParams()
  
  // Add fields with pagination parameters
  const fieldsWithPagination = [...fields]
  fieldsWithPagination.push(`fact.limit(${limit})`)
  if (offset > 0) {
    fieldsWithPagination.push(`fact.offset(${offset})`)
  }
  params.append('fields', fieldsWithPagination.join(','))
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','))
    } else {
      params.append(key, String(value))
    }
  })

  // Add delay if specified
  if (wait > 0) {
    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, wait);
        if (signal) {
          signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new Error('Query was cancelled'));
          });
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Query was cancelled') {
        throw error;
      }
    }
  }

  const response = await fetch(`https://api.xbrl.us/api/v1/${endpoint}?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    },
    signal // Pass the abort signal to fetch
  })

  const responseData = await response.json()

  // Check for limit error and retry with correct limit if needed
  if (responseData.error === 'Invalid Limit Amount') {
    const limitMatch = responseData.error_description?.match(/Your user limit amount is (\d+)/);
    if (limitMatch && limitMatch[1]) {
      const newLimit = parseInt(limitMatch[1], 10);
      // Retry the query with the correct limit
      return searchFacts(accessToken, {
        ...{ endpoint, fields, filters, offset, wait },
        limit: newLimit
      });
    }
  }

  if (!response.ok) {
    throw new Error(responseData.error_description || responseData.error || response.statusText)
  }

  return {
    data: responseData.data || [],
    paging: {
      limit: responseData.paging?.limit || limit,
      offset: responseData.paging?.offset || offset,
      count: responseData.paging?.count || 0
    },
    cached_time: responseData.cached_time || undefined
  }
}

export async function detectUserLimit(accessToken: string): Promise<number> {
  const params = new URLSearchParams({
    'fields': 'fact.value,fact.limit(10000)'
  });

  const response = await fetch(`https://api.xbrl.us/api/v1/fact/search?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  const data: UserLimitError = await response.json();
  
  if (data.error === 'Invalid Limit Amount' && data.error_description) {
    // Extract the limit from error message using regex
    const limitMatch = data.error_description.match(/Your user limit amount is (\d+)/);
    if (limitMatch && limitMatch[1]) {
      return parseInt(limitMatch[1], 10);
    }
  }
  
  return 100; // Default conservative limit if we can't detect
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
    queryFn: ({ signal }) => searchFacts(accessToken, params, signal),
    enabled: !!accessToken && (options?.enabled ?? true),
  })
}

export function useUserLimit(accessToken: string) {
  return useQuery({
    queryKey: ['userLimit'],
    queryFn: () => detectUserLimit(accessToken),
    enabled: !!accessToken,
    staleTime: Infinity, // This value won't change during the session
    gcTime: Infinity,  // Changed from cacheTime to gcTime
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useFactById(accessToken: string, factId: string | number) {
  return useQuery({
    queryKey: ['facts', 'byId', factId],
    queryFn: () => getFactById(accessToken, factId),
    enabled: !!accessToken && !!factId,
  })
}

export type { FactSearchParams, FactResponse, FactData }
