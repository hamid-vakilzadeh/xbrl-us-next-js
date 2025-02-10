// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
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
  )
}