import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PageLayout } from '@/components/layout/page-layout'

export default function HomePage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to XBRL Explorer
          </h1>
          <p className="text-xl text-gray-600 max-w-[600px]">
            Access and analyze financial data using the XBRL API
          </p>
          <Link href="/signin">
            <Button size="lg" className="mt-6">
              Sign In to Get Started
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}