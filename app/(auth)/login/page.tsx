"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showVerificationLink, setShowVerificationLink] = useState(false)

  useEffect(() => {
    const errorParam = searchParams?.get("error")
    const errorDescription = searchParams?.get("error_description") || searchParams?.get("message")
    const email = searchParams?.get("email")
    const successParam = searchParams?.get("success")

    if (successParam === "verification") {
      setSuccess("Your email has been verified successfully. Please sign in to continue.")
    }

    if (errorParam) {
      let errorMessage = "An error occurred during authentication."

      if (errorParam === "auth") {
        errorMessage = "Authentication failed. Please try again."
      } else if (errorParam === "access_denied" && errorDescription?.includes("expired")) {
        errorMessage = "Your verification link has expired. Please request a new one."
        setShowVerificationLink(true)
      } else if (errorDescription) {
        errorMessage = decodeURIComponent(errorDescription)
      }

      setError(errorMessage)
    }
  }, [searchParams])

  return (
    <AuthLayout title="Sign In" description="Enter your credentials to access your account">
      {success && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
          <AlertTitle className="text-green-700 dark:text-green-300">Success</AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-300">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {error}
            {showVerificationLink && (
              <div className="mt-2">
                <Link href="/verify" className="text-blue-600 hover:text-blue-800 underline">
                  Request a new verification email
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      <LoginForm />
    </AuthLayout>
  )
}

