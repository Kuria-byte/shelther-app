import type { ReactNode } from "react"
import { OnboardingProvider } from "@/contexts/onboarding-context"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <OnboardingProvider>{children}</OnboardingProvider>
    </div>
  )
}
