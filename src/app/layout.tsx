// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/components/auth/auth-provider'
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
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <AuthProvider>{children}</AuthProvider>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}