"use client"

import { useUser } from "@/contexts/user-context"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

export function PersonalizedGreeting() {
  const { user } = useUser()

  if (!user) return null

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold dark:text-white">
        {getGreeting()}, {user.name}
      </h1>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
        <Clock className="h-4 w-4 mr-1" />
        <span>{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
      </div>
    </motion.div>
  )
}

