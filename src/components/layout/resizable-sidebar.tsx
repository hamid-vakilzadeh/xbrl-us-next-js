'use client'

import React, { useCallback, memo, useEffect } from 'react'
import { useDashboardStore } from '@/store/dashboard'
import { sidebarConfig } from '@/config/dashboard'

interface ResizableSidebarProps {
  children: React.ReactNode
}

export const ResizableSidebar = memo(function ResizableSidebar({ children }: ResizableSidebarProps) {
  const { sidebarWidth, setSidebarWidth } = useDashboardStore()
  const [isResizing, setIsResizing] = React.useState(false)
  
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return

    const newWidth = Math.min(
      Math.max(e.clientX, sidebarConfig.minWidth),
      sidebarConfig.maxWidth
    )
    setSidebarWidth(newWidth)
  }, [isResizing, setSidebarWidth])

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  // Enforce minimum width on mount and width changes
  useEffect(() => {
    if (sidebarWidth < sidebarConfig.minWidth) {
      setSidebarWidth(sidebarConfig.minWidth)
    }
  }, [sidebarWidth, setSidebarWidth])

  return (
    <div 
      className="relative flex-shrink-0" 
      style={{ 
        width: sidebarWidth,
        minWidth: sidebarConfig.minWidth,
        transition: isResizing ? 'none' : sidebarConfig.resizeTransition
      }}
    >
      <div 
        className="absolute inset-y-0 right-0 w-1 cursor-col-resize bg-border hover:bg-primary/50 transition-colors"
        onMouseDown={handleMouseDown}
      />
      <div className="h-full overflow-auto border-r bg-background">
        {children}
      </div>
    </div>
  )
})