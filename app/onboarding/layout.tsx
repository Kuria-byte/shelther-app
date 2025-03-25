import { OnboardingProvider } from "@/contexts/onboarding-context"
import type { ReactNode } from "react"

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">{children}</div>
    </OnboardingProvider>
  )
}

