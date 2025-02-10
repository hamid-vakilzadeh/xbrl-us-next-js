import { SignInForm } from '@/components/auth/signin-form'
import { PageLayout } from '@/components/layout/page-layout'

export default function SignInPage() {
  return (
    <PageLayout>
      <div className="flex justify-center items-center h-full">
        <SignInForm />
      </div>
    </PageLayout>
  )
}