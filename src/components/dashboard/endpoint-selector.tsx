'use client'

import { useXBRLMeta } from '@/hooks/use-xbrl-meta'
import { Combobox } from '@/components/ui/combobox'
import { Icons } from '@/components/shared/Icons'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'

interface EndpointSelectorProps {
  onEndpointSelect: (endpoint: string) => void
  selectedEndpoint?: string
}

export function EndpointSelector({ onEndpointSelect, selectedEndpoint }: EndpointSelectorProps) {
  const { meta, isLoading, error, refetch } = useXBRLMeta()

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
            {error.message}
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Try Again
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
    <div className="p-4">
      <h2 className="text-sm font-medium mb-2">
        XBRL API Endpoints
      </h2>
      <Combobox
        options={options}
        value={selectedEndpoint}
        onSelect={onEndpointSelect}
        placeholder="Search endpoints..."
        emptyText="No endpoints found."
      />
    </div>
  )
}