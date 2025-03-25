"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { StatusCard } from "@/components/status-card"
import { QuickActions } from "@/components/quick-actions"
import { EmergencyTrigger } from "@/components/emergency-trigger"
import { BottomNavigation } from "@/components/bottom-navigation"
import { EmergencyActivation } from "@/components/emergency-activation"
import { EmergencyActive } from "@/components/emergency-active"
import { EmergencyResolution } from "@/components/emergency-resolution"
import { Header } from "@/components/header"
import { PersonalizedGreeting } from "@/components/personalized-greeting"
import { SafetyInsights } from "@/components/safety-insights"
import { MoodStatusSelector } from "@/components/mood-status-selector"
import { RecentActivity } from "@/components/recent-activity"
import { SafetyTip } from "@/components/safety-tip"
import { motion } from "framer-motion"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading: isUserLoading } = useUser()
  const [emergencyState, setEmergencyState] = useState<"none" | "activating" | "active" | "resolving">("none")
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check authentication status only after component is mounted
  useEffect(() => {
    if (isMounted) {
      try {
        const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
        const isAuthenticated = localStorage.getItem("isAuthenticated")

        if (!hasCompletedOnboarding) {
          router.push("/onboarding")
        } else if (!isAuthenticated) {
          router.push("/login")
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsLoading(false)
      }
    }
  }, [isMounted, router])

  const handleEmergencyActivate = () => {
    setEmergencyState("activating")
  }

  const handleEmergencyConfirm = () => {
    setEmergencyState("active")
  }

  const handleEmergencyCancel = () => {
    setEmergencyState("none")
  }

  const handleEmergencyResolve = () => {
    setEmergencyState("resolving")
  }

  const handleEmergencyResolutionComplete = () => {
    setEmergencyState("none")
  }

  const validateStatus = (status: string | undefined): "safe" | "cautious" | "danger" => {
    if (status === "safe" || status === "cautious" || status === "danger") {
      return status;
    }
    return "safe";
  }

  // Show loading state while checking authentication or loading user data
  if (isLoading || !isMounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-[#8A4FFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 relative">
      {emergencyState === "none" && (
        <>
          <Header />
          <div className="flex-1 overflow-auto px-4 pb-24 pt-8 space-y-6">
            <PersonalizedGreeting />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <StatusCard status={validateStatus(user?.moodStatus)} />
            </motion.div>

            <div className="pt-2">
              <SafetyInsights />
            </div>

            <div className="pt-2">
              <MoodStatusSelector />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="pt-2"
            >
              <QuickActions />
            </motion.div>

            <div className="pt-2">
              <RecentActivity />
            </div>

            <div className="pt-2">
              <SafetyTip />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-4"
            >
              <EmergencyTrigger onActivate={handleEmergencyActivate} />
            </motion.div>
          </div>
          <BottomNavigation />
        </>
      )}

      {emergencyState === "activating" && (
        <EmergencyActivation onConfirm={handleEmergencyConfirm} onCancel={handleEmergencyCancel} />
      )}

      {emergencyState === "active" && <EmergencyActive onResolve={handleEmergencyResolve} />}

      {emergencyState === "resolving" && <EmergencyResolution onComplete={handleEmergencyResolutionComplete} />}
    </div>
  )
}

