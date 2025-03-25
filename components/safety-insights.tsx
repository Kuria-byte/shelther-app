"use client"

import { useUser } from "@/contexts/user-context"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export function SafetyInsights() {
  const { user } = useUser()

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6"
    >
      <h2 className="text-lg font-medium mb-3 dark:text-white">Your Safety Insights</h2>
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none shadow-sm dark:bg-gray-800">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#36D986]/10 flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-[#36D986]" />
            </div>
            <span className="text-xl font-bold dark:text-white">{user.safeDays}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Days Safe</span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-gray-800">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-[#8A4FFF]" />
            </div>
            <span className="text-xl font-bold dark:text-white">{user.nearbyFriends}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Friends Nearby</span>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm dark:bg-gray-800">
          <CardContent className="p-3 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[#40E0D0]/10 flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-[#40E0D0]" />
            </div>
            <span className="text-xl font-bold dark:text-white">5</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Check-ins</span>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}

