'use client'

import { memo, useEffect } from 'react'
import { Icons } from '@/components/shared/Icons'
import { Card, CardContent } from '@/components/ui/Card'
import { useDashboardStore } from '@/store/dashboard'
import { useEndpointData } from '@/hooks/use-endpoint-data'

export const Canvas = memo(function Canvas() {
  const { selectedEndpoint, isCanvasLoading, canvasData } = useDashboardStore()
  const { fetchEndpointData } = useEndpointData()

  useEffect(() => {
    if (selectedEndpoint) {
      fetchEndpointData(selectedEndpoint)
    }
  }, [selectedEndpoint, fetchEndpointData])

  if (!selectedEndpoint) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Icons.database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Endpoint Selected</h3>
            <p className="text-muted-foreground">
              Choose an endpoint from the sidebar to view its data
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isCanvasLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="h-full w-full p-6">
      <h2 className="text-2xl font-bold mb-4">
        {selectedEndpoint}
      </h2>
      {canvasData && (
        <div className="grid gap-4">
          <pre className="p-4 bg-muted rounded-lg overflow-auto">
            {JSON.stringify(canvasData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
})