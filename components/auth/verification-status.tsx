"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Check, RefreshCw, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"

interface VerificationStatusProps {
  email?: string // Make email optional
}

export function VerificationStatus({ email: propEmail }: VerificationStatusProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { resendVerificationEmail } = useAuth()

  // Get redirect URL from query params
  const redirectPath = searchParams?.get("redirect") || "/"

  // State for email input
  const [email, setEmail] = useState(propEmail || "")

  // State for resend operation
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address is missing. Please go back to sign in.")
      return
    }

    setIsResending(true)
    setResendMessage(null)
    setError(null)

    try {
      await resendVerificationEmail(email)
      setResendMessage("Verification email resent. Please check your inbox.")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex justify-center">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4">
            <AlertTriangle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Verify your email</h2>
          {email ? (
            <p className="text-gray-600 dark:text-gray-400">
              We&apos;ve sent a verification link to <strong>{email}</strong>
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              We&apos;ve sent a verification link to your email address.
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please check your inbox and click the verification link to continue.
          </p>
          {redirectPath !== "/" && (
            <p className="text-sm text-purple-600 dark:text-purple-400">
              You'll be redirected to your requested page after verification.
            </p>
          )}
        </div>

        {error && (
          <Alert className="border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resendMessage && (
          <Alert className="border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950">
            <Check className="h-4 w-4 mr-2" />
            <AlertDescription>{resendMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button onClick={handleResendVerification} variant="outline" className="w-full" disabled={isResending}>
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push("/login")}
            variant="link"
            className="w-full text-gray-600 dark:text-gray-400"
          >
            Back to Sign In
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

