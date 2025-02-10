'use client'

import { useState } from 'react'

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      setIsLoading(true)
      // Handle sign in
    }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label 
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="m@example.com"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 transition-colors"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </form>
  )
}