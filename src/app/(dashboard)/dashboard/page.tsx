'use client'

import dynamic from 'next/dynamic'
import { Suspense, useState, useEffect } from 'react'
import { EndpointSelector } from '@/components/dashboard/endpoint-selector'
import { Icons } from '@/components/shared/Icons'
import { ResizableSidebar } from '@/components/layout/resizable-sidebar'

const SELECTED_ENDPOINT_KEY = 'xbrl_selected_endpoint'

// Dynamically import Canvas with no SSR to avoid hydration issues with dynamic data
const Canvas = dynamic(
  () => import('@/components/dashboard/canvas').then(mod => ({ default: mod.Canvas })),
  {
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false
  }
)

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
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Icons.spinner className="h-8 w-8 animate-spin" />
          </div>
        }>
          <Canvas />
        </Suspense>
      </main>
    </div>
  )
}