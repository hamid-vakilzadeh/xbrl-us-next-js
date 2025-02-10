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

const META_STORAGE_KEY = 'xbrl_meta_data'

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

export function getStoredMeta(): XBRLMeta | null {
  const storedData = localStorage.getItem(META_STORAGE_KEY)
  if (!storedData) return null
  
  return JSON.parse(storedData) as XBRLMeta
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

export type {XBRLMeta}
