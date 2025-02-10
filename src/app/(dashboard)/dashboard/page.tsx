'use client'

import { useState, useEffect } from 'react'
import { EndpointSelector } from '@/components/dashboard/endpoint-selector'
import { Canvas } from '@/components/dashboard/canvas'
import { ResizableSidebar } from '@/components/layout/resizable-sidebar'

const SELECTED_ENDPOINT_KEY = 'xbrl_selected_endpoint'

export default function DashboardPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>()

  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_ENDPOINT_KEY)
    if (stored) {
      setSelectedEndpoint(stored)
    }
  }, [])

  const handleEndpointSelect = (endpoint: string) => {
    setSelectedEndpoint(endpoint)
    localStorage.setItem(SELECTED_ENDPOINT_KEY, endpoint)
  }

  return (
    <div className="flex h-full">
      <ResizableSidebar>
        <EndpointSelector
          selectedEndpoint={selectedEndpoint}
          onEndpointSelect={handleEndpointSelect}
        />
      </ResizableSidebar>
      <main className="flex-1 min-w-0">
        <Canvas selectedEndpoint={selectedEndpoint} />
      </main>
    </div>
  )
}