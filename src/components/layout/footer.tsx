// src/components/layout/footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} XBRL Explorer. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link
            href="https://xbrl.us/privacy-policy"
            className="text-sm text-gray-500 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://xbrl.us/terms-of-service"
            className="text-sm text-gray-500 hover:text-gray-900"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}