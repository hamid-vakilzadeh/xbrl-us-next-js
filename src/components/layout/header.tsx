'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { isAuthenticated, signOut } = useAuth()
  const router = useRouter()

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await signOut()
      router.push('/')
    } else {
      router.push('/signin')
    }
  }

  return (
    <header className="w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">XBRL Explorer</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link 
            href="https://xbrl.us/home/about" 
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            About XBRL
          </Link>
          <Link 
            href="https://xbrl.us/support" 
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support
          </Link>
          <Button 
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
            onClick={handleAuthClick}
          >
            {isAuthenticated ? 'Sign Out' : 'Sign In'}
          </Button>
        </nav>
      </div>
    </header>
  )
}