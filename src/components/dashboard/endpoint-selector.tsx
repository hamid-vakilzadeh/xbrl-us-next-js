'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import { useXBRLMeta } from '@/hooks/use-xbrl-meta'
import { Combobox } from '@/components/ui/combobox'
import { Icons } from '@/components/shared/Icons'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { useDashboardStore } from '@/store/dashboard'
import { sidebarConfig } from '@/config/dashboard'

export const EndpointSelector = memo(function EndpointSelector() {
  const router = useRouter()
  const { meta, isLoading, error } = useXBRLMeta()
  const { selectedEndpoint, setSelectedEndpoint } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <Icons.spinner className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            Please sign in to access XBRL endpoints
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => router.push('/signin')}
        >
          Sign In
        </Button>
      </div>
    )
  }

  if (!meta) {
    return (
      <div className="text-muted-foreground p-4 text-sm">
        No endpoint data available
      </div>
    )
  }

  const options = Object.entries(meta).map(([key, value]) => ({
    value: key,
    label: `${key} (${value.object})`
  }))

  return (
    <div 
      className="w-full space-y-4 p-4" 
      style={{ 
        minWidth: sidebarConfig.minWidth - (2 * sidebarConfig.padding.x * 4), // Account for parent padding
        maxWidth: sidebarConfig.maxWidth - (2 * sidebarConfig.padding.x * 4)
      }}
    >
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-foreground">
          XBRL API Endpoints
        </h2>
        <p className="text-xs text-muted-foreground">
          Select an endpoint to view its data
        </p>
      </div>
      <div className="relative w-full">
        <Combobox
          options={options}
          value={selectedEndpoint}
          onSelect={setSelectedEndpoint}
          placeholder="Search endpoints..."
          emptyText="No endpoints found."
          className="w-full"
        />
      </div>
    </div>
  )
})