'use client'

import { Icons } from '@/components/shared/Icons'
import { Card, CardContent } from '@/components/ui/Card'

interface CanvasProps {
  selectedEndpoint?: string
}

export function Canvas({ selectedEndpoint }: CanvasProps) {
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

  return (
    <div className="h-full w-full p-6">
      <h2 className="text-2xl font-bold mb-4">
        {selectedEndpoint}
      </h2>
      {/* Add endpoint specific content here */}
    </div>
  )
}