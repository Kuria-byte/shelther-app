"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useOnboarding } from "@/contexts/onboarding-context"
import { updateProfile } from "@/lib/api/profile"

export default function CompletePageContent() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { completeOnboarding } = useOnboarding()

  const handleComplete = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Mark onboarding as completed in the database
      await updateProfile({ onboarding_completed: true })

      // Call the context method
      await completeOnboarding()

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Error completing onboarding:", err)
      setError("Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <Card className="border-green-200 shadow-md">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <div className="mb-6 bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Setup Complete!</h1>
          <p className="text-gray-600 mb-6">
            Your Shelther account is now ready to use. You can always update your settings later.
          </p>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 w-full">{error}</div>}

          <Button onClick={handleComplete} disabled={isLoading} className="w-full">
            {isLoading ? "Finalizing..." : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

