"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/contexts/onboarding-context"
import { WelcomeScreen } from "@/components/onboarding/welcome-screen"
import { ValuePropositionScreen } from "@/components/onboarding/value-proposition-screen"
import { PermissionsScreen } from "@/components/onboarding/permissions-screen"
import { SignUpScreen } from "@/components/onboarding/sign-up-screen"
import { SafetySetupScreen } from "@/components/onboarding/safety-setup-screen"
import { SuccessScreen } from "@/components/onboarding/success-screen"

export default function OnboardingPage() {
  const router = useRouter()
  const { currentStep } = useOnboarding()

  // Redirect to home if user is already authenticated
  useEffect(() => {
    const checkAuth = () => {
      try {
        const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
        const isAuthenticated = localStorage.getItem("isAuthenticated")

        if (hasCompletedOnboarding && isAuthenticated) {
          router.push("/")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
      }
    }

    // Run after component mounts to ensure we're in the browser
    checkAuth()
  }, [router])

  // Render the appropriate screen based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen />
      case 2:
      case 3:
      case 4:
      case 5:
        return <ValuePropositionScreen step={currentStep - 1} />
      case 6:
      case 7:
      case 8:
        return <PermissionsScreen step={currentStep - 5} />
      case 9:
        return <SignUpScreen />
      case 10:
        return <SafetySetupScreen />
      case 11:
        return <SuccessScreen />
      default:
        return <WelcomeScreen />
    }
  }

  return <>{renderStep()}</>
}

