// src/app/(auth)/signin/page.tsx
import { SignInForm } from '@/components/auth/signin-form'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm />
    </div>
  )
}