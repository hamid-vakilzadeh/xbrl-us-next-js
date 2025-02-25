// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'

import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'XBRL Explorer',
  description: 'Explore and analyze XBRL financial data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {/*<Header />*/}
            <main className="flex-1">
              {children}
            </main>
            {/*<Footer />*/}
          </div>
        </Providers>
      </body>
    </html>
  )
}