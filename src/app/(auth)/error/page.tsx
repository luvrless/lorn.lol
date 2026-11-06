'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

const errorMessages: Record<string, string> = {
  OAuthSignin: 'Error occurred during OAuth sign-in. Please try again.',
  OAuthCallback: 'Error occurred during OAuth callback. Please try again.',
  OAuthCreateAccount: 'Could not create account with this OAuth provider.',
  EmailCreateAccount: 'Could not create account with this email.',
  Callback: 'Error occurred during authentication callback.',
  OAuthAccountNotLinked: 'Email already associated with another account. Please sign in with the original method.',
  EmailSignin: 'Error sending sign-in email.',
  CredentialsSignin: 'Invalid credentials. Please check your username and password.',
  SessionRequired: 'Please sign in to access this page.',
  AccessDenied: 'Access denied. You do not have permission to view this resource.',
  Default: 'An authentication error occurred. Please try again.',
}

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const message = errorMessages[error] || errorMessages.Default

  return (
    <Card className="glass-dark border-border/50 shadow-2xl backdrop-blur-xl">
      <CardHeader className="text-center space-y-3">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-destructive" />
        </div>
        <CardTitle className="text-2xl font-bold font-display">Authentication Error</CardTitle>
        <CardDescription className="text-muted-foreground text-sm max-w-sm mx-auto">
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/auth/signin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </Button>
        <Button variant="ghost" asChild className="w-full text-muted-foreground hover:text-foreground">
          <Link href="/">Return to Home</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <Suspense fallback={
          <div className="glass-dark p-8 rounded-2xl text-center text-muted-foreground">
            Loading...
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  )
}
