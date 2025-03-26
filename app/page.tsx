"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return

    // Check if user is authenticated and has completed onboarding
    if (session?.user) {
      const onboardingStatus = session.user.onboardingStatus
      if (onboardingStatus >= 11) {
        localStorage.setItem('isAuthenticated', 'true') // Set authentication state
        router.replace("/dashboard")
      } else {
        // If onboarding is not complete, redirect to the appropriate step
        router.replace(`/onboarding?step=${onboardingStatus || 1}`)
      }
    } else {
      // If no session, start from beginning
      router.replace('/onboarding')
    }
  }, [status, session, router])

  // Show loading state
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-16 h-16 border-4 border-[#8A4FFF] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

