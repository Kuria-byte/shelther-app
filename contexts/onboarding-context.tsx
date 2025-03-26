"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface OnboardingContextType {
  currentStep: number
  totalSteps: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  completeOnboarding: () => void
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}

interface OnboardingProviderProps {
  children: ReactNode
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlStep = new URLSearchParams(window.location.search).get('step')
      return parseInt(urlStep || localStorage.getItem('onboardingStep') || '1')
    }
    return 1
  })
  const totalSteps = 11

  // Check authentication and step after email verification
  useEffect(() => {
    if (status === "authenticated" && session?.user?.emailVerified) {
      // After email verification, continue from step 10
      setCurrentStep(prev => prev < 10 ? 10 : prev)
    }
  }, [status, session])

  // Persist step to localStorage
  useEffect(() => {
    localStorage.setItem('onboardingStep', currentStep.toString())
  }, [currentStep])

  const nextStep = () => {
    if (currentStep === 9) {
      // Redirect to signup at step 9
      router.push('/auth/signup')
      return
    } else if (currentStep === 10 && !session?.user?.emailVerified) {
      // Don't proceed to step 10 if email isn't verified
      return
    } else if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    } else if (currentStep === totalSteps) {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      // Don't go below step 10 if authenticated and verified
      if (session?.user?.emailVerified && currentStep <= 10) {
        return
      }
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      // Don't allow going below step 10 if authenticated and verified
      if (session?.user?.emailVerified && step < 10) {
        return
      }
      setCurrentStep(step)
    }
  }

  const completeOnboarding = async () => {
    if (!session?.user) {
      router.push('/onboarding')
      return
    }

    try {
      const response = await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          email: session.user.email,
          name: session.user.name,
          onboardingStatus: 11,
          emailVerified: session.user.emailVerified
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Onboarding completion error:', errorData)
        throw new Error(errorData.error || 'Failed to complete onboarding')
      }

      const data = await response.json()
      
      if (data.success) {
        // Update all required localStorage items
        localStorage.removeItem('onboardingStep')
        localStorage.setItem('hasCompletedOnboarding', 'true')
        localStorage.setItem('isAuthenticated', 'true')
        router.replace("/dashboard") // Use replace instead of push
      } else {
        throw new Error(data.error || 'Failed to complete onboarding')
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error)
      throw error
    }
  }

  const value = {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    completeOnboarding,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

