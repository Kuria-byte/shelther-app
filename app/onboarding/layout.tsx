"use client"

import type React from "react"

import { OnboardingProvider } from "@/contexts/onboarding-context"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-blue-50">{children}</div>
    </OnboardingProvider>
  )
}

