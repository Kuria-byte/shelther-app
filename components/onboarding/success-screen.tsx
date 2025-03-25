"use client"

import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { CheckCircle } from "lucide-react"

export function SuccessScreen() {
  const { completeOnboarding } = useOnboarding()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="w-24 h-24 rounded-full bg-[#36D986]/20 flex items-center justify-center mb-6">
        <CheckCircle className="h-12 w-12 text-[#36D986]" />
      </div>

      <h1 className="text-3xl font-bold mb-4">You're Protected!</h1>

      <p className="text-gray-600 max-w-md mb-8">
        Your Shelther account is set up and ready to keep you safe. You can now access all safety features.
      </p>

      <Button onClick={completeOnboarding} className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
        Go to Dashboard
      </Button>
    </div>
  )
}

