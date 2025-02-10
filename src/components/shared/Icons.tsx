'use client'

import { Database, Loader2, LucideIcon } from 'lucide-react'

export type IconType = LucideIcon

interface Icons {
  database: IconType
  spinner: IconType
  // Add more icons as needed
}

export const Icons: Icons = {
  database: Database,
  spinner: Loader2,
}

export type IconKeys = keyof typeof Icons