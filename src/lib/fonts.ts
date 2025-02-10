import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const fontHeading = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
})