import '@/styles/globals.css'
import '@/styles/tokens.css'
import { fontSans, fontMono, fontHeading } from '@/lib/fonts'
import { AuthProvider } from '@/components/auth/auth-provider'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'XBRL US App',
  description: 'XBRL US Next.js Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontMono.variable} ${fontHeading.variable} font-sans`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}