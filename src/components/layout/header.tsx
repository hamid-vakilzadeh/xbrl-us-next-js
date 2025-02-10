// src/components/layout/header.tsx
import Link from 'next/link'

export function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">XBRL Explorer</span>
        </Link>
        <nav className="flex items-center space-x-4">
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
        </nav>
      </div>
    </header>
  )
}