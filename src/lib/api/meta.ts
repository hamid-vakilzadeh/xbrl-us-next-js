interface MetaEndpoint {
  object: string
  link: string
}

interface XBRLMeta {
  assertion: MetaEndpoint
  concept: MetaEndpoint
  cube: MetaEndpoint
  document: MetaEndpoint
  dts: MetaEndpoint
  'dts/concept': MetaEndpoint
  'dts/network': MetaEndpoint
  entity: MetaEndpoint
  'entity/report': MetaEndpoint
  fact: MetaEndpoint
  label: MetaEndpoint
  network: MetaEndpoint
  'network/relationship': MetaEndpoint
  relationship: MetaEndpoint
  report: MetaEndpoint
  'report/fact': MetaEndpoint
  'report/network': MetaEndpoint
}

interface EndpointMetadata {
  endpoints?: {
    [key: string]: string;
  };
  examples?: {
    [key: string]: string;
  };
  fields?: {
    [key: string]: {
      searchable?: string;
      type?: string;
      database_field?: string;
      definition?: string;
      format?: string;
    };
  };
}

interface AllEndpointsMetadata {
  assertion?: EndpointMetadata;
  concept?: EndpointMetadata;
  cube?: EndpointMetadata;
  document?: EndpointMetadata;
  dts?: EndpointMetadata;
  'dts/concept'?: EndpointMetadata;
  'dts/network'?: EndpointMetadata;
  entity?: EndpointMetadata;
  'entity/report'?: EndpointMetadata;
  fact?: EndpointMetadata;
  label?: EndpointMetadata;
  network?: EndpointMetadata;
  'network/relationship'?: EndpointMetadata;
  relationship?: EndpointMetadata;
  report?: EndpointMetadata;
  'report/fact'?: EndpointMetadata;
  'report/network'?: EndpointMetadata;
}

const META_STORAGE_KEY = 'xbrl_meta_data'
const ENDPOINTS_META_STORAGE_KEY = 'xbrl_endpoints_meta_data'

export async function fetchXBRLMeta(accessToken: string): Promise<XBRLMeta> {
  const response = await fetch('https://api.xbrl.us/api/v1/meta', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch XBRL meta data')
  }

  const data = await response.json() as XBRLMeta
  
  // Store in localStorage for future use
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(data))
  
  return data
}

export async function fetchEndpointMeta(accessToken: string, endpoint: keyof XBRLMeta, baseUrl: string): Promise<EndpointMetadata> {
  const response = await fetch(`${baseUrl}/meta/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch XBRL ${endpoint} meta data`)
  }

  return await response.json() as EndpointMetadata
}

export async function fetchAllEndpointsMeta(accessToken: string, meta: XBRLMeta): Promise<AllEndpointsMetadata> {
  const allMetadata: AllEndpointsMetadata = {}
  const errors: string[] = []

  // Process endpoints in parallel
  const metadataPromises = Object.entries(meta).map(async ([endpoint, value]) => {
    try {
      const baseUrl = value.link.split('/meta/')[0]
      const metadata = await fetchEndpointMeta(accessToken, endpoint as keyof XBRLMeta, baseUrl)
      return { endpoint, metadata }
    } catch (error) {
      errors.push(`Failed to fetch metadata for ${endpoint}: ${error}`)
      return { endpoint, metadata: null }
    }
  })

  const results = await Promise.all(metadataPromises)
  
  results.forEach(({ endpoint, metadata }) => {
    if (metadata) {
      allMetadata[endpoint as keyof XBRLMeta] = metadata
    }
  })

  // Store in localStorage
  localStorage.setItem(ENDPOINTS_META_STORAGE_KEY, JSON.stringify(allMetadata))
  
  if (errors.length > 0) {
    console.warn('Some metadata fetches failed:', errors)
  }

  return allMetadata
}

export function getStoredMeta(): XBRLMeta | null {
  const storedData = localStorage.getItem(META_STORAGE_KEY)
  if (!storedData) return null
  
  return JSON.parse(storedData) as XBRLMeta
}

export function getStoredEndpointsMeta(): AllEndpointsMetadata | null {
  const storedData = localStorage.getItem(ENDPOINTS_META_STORAGE_KEY)
  if (!storedData) return null
  
  return JSON.parse(storedData) as AllEndpointsMetadata
}

// Helper function to get specific endpoint link
export function getEndpointLink(endpointKey: keyof XBRLMeta): string | null {
  const meta = getStoredMeta()
  if (!meta) return null
  
  return meta[endpointKey]?.link || null
}

// Helper function to get all available endpoints
export function getAllEndpoints(): Record<keyof XBRLMeta, string> | null {
  const meta = getStoredMeta()
  if (!meta) return null
  
  const endpoints: Partial<Record<keyof XBRLMeta, string>> = {}
  
  for (const key in meta) {
    endpoints[key as keyof XBRLMeta] = meta[key as keyof XBRLMeta].link
  }
  
  return endpoints as Record<keyof XBRLMeta, string>
}

export function getEndpointMeta(endpoint: keyof XBRLMeta): EndpointMetadata | null {
  const allMeta = getStoredEndpointsMeta()
  if (!allMeta) return null
  
  return allMeta[endpoint] || null
}

export type { XBRLMeta, EndpointMetadata, AllEndpointsMetadata }
