import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { sidebarConfig } from '@/config/dashboard'

interface DashboardState {
  selectedEndpoint: string | undefined
  sidebarWidth: number
  isCanvasLoading: boolean
  canvasData: any // Type this according to your API response
  setSelectedEndpoint: (endpoint: string) => void
  setSidebarWidth: (width: number) => void
  setCanvasLoading: (loading: boolean) => void
  setCanvasData: (data: any) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      selectedEndpoint: undefined,
      sidebarWidth: sidebarConfig.defaultWidth,
      isCanvasLoading: false,
      canvasData: null,
      setSelectedEndpoint: (endpoint) => set({ selectedEndpoint: endpoint }),
      setSidebarWidth: (width) => set({ 
        sidebarWidth: Math.min(
          Math.max(width, sidebarConfig.minWidth),
          sidebarConfig.maxWidth
        ) 
      }),
      setCanvasLoading: (loading) => set({ isCanvasLoading: loading }),
      setCanvasData: (data) => set({ canvasData: data }),
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ 
        selectedEndpoint: state.selectedEndpoint,
        sidebarWidth: state.sidebarWidth 
      }),
    }
  )
)