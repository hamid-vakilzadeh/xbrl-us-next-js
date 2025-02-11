'use client'

import React, { useCallback, memo } from 'react'
import { useDashboardStore } from '@/store/dashboard'

interface ResizableSidebarProps {
  children: React.ReactNode
}

export const ResizableSidebar = memo(function ResizableSidebar({ children }: ResizableSidebarProps) {
  const { sidebarWidth, setSidebarWidth } = useDashboardStore()
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    
    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = e.clientX
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [setSidebarWidth])

  return (
    <div className="relative flex-shrink-0" style={{ width: sidebarWidth }}>
      <div className="absolute inset-y-0 right-0 w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
           onMouseDown={handleMouseDown}
      />
      <div className="h-full overflow-auto border-r bg-background">
        {children}
      </div>
    </div>
  )
})