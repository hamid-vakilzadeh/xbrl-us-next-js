'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from '@/components/auth/auth-provider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  )
}