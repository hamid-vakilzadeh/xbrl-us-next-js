'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { Alert, AlertDescription } from '@/components/ui/Alert'
import { Icons } from '@/components/shared/Icons'
import { useXBRLAuth } from '@/hooks/use-xbrl-auth'
import { useAuth } from '@/components/auth/auth-provider'
import { fetchXBRLMeta, fetchAllEndpointsMeta } from '@/lib/api/meta'

export function SignInForm() {
  const { signIn: signInXBRL, isLoading, error } = useXBRLAuth()
  const { signIn: signInAuth } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    clientId: '',
    clientSecret: ''
  })

  const [errorMessage, setErrorMessage] = useState<string>('')

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')

    try {
      const authResult = await signInXBRL(
        formData.email,
        formData.password,
        formData.clientId,
        formData.clientSecret
      )
      
      await signInAuth(
        formData.email,
        authResult.access_token,
        authResult.refresh_token,
        Date.now() + authResult.expires_in * 1000,
        formData.clientId,
        formData.clientSecret
      )

      // Fetch and store meta data
      try {
        const mainMeta = await fetchXBRLMeta(authResult.access_token)
        await fetchAllEndpointsMeta(authResult.access_token, mainMeta)
      } catch (metaError) {
        console.error('Failed to fetch meta data:', metaError)
      }
      
      router.push('/dashboard')
    } catch (err: any) {
      if (err.code === 'UNAUTHORIZED') {
        setErrorMessage('Invalid credentials. Please check your email and password.')
      } else if (err.code === 'BAD_REQUEST') {
        setErrorMessage('Please check all fields are filled correctly.')
      } else {
        setErrorMessage('An error occurred. Please try again.')
      }
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in to XBRL</CardTitle>
        <CardDescription>
          Enter your XBRL credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              name="clientId"
              type="text"
              placeholder="Your XBRL Client ID"
              value={formData.clientId}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              name="clientSecret"
              type="password"
              placeholder="Your XBRL Client Secret"
              value={formData.clientSecret}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}