'use client'

import { useAuthGuard } from '@/hooks/use-auth-guard'
import { useAuth } from '@/components/auth/auth-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function DashboardPage() {
  const { isLoading } = useAuthGuard()
  const { user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is a placeholder content area. The main dashboard content will be rendered here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}