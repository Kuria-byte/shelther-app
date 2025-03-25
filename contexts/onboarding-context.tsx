"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

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
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 11 // Total number of steps in the onboarding flow

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }

  // Update the completeOnboarding function to set isAuthenticated and redirect to home
  const completeOnboarding = () => {
    localStorage.setItem("hasCompletedOnboarding", "true")
    localStorage.setItem("isAuthenticated", "true") // Set authenticated directly
    router.push("/") // Redirect to home instead of login
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

