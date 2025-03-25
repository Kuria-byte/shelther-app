"use client"

import { useUser } from "@/contexts/user-context"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Map, AlertTriangle, Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function RecentActivity() {
  const { user } = useUser()

  if (!user || !user.recentCheckIns.length) return null

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "check-in":
        return { icon: CheckCircle, color: "#36D986" }
      case "journey":
        return { icon: Map, color: "#8A4FFF" }
      case "alert":
        return { icon: AlertTriangle, color: "#FF9D4D" }
      default:
        return { icon: CheckCircle, color: "#36D986" }
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      month: "short",
      day: "numeric",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-6"
    >
      <h2 className="text-lg font-medium mb-3 dark:text-white">Recent Activity</h2>
      <Card className="border-none shadow-sm dark:bg-gray-800">
        <CardContent className="p-4 space-y-4">
          {user.recentCheckIns.map((activity) => {
            const { icon: ActivityIcon, color } = getActivityIcon(activity.type)

            return (
              <div key={activity.id} className="flex items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0"
                  style={{ backgroundColor: `${color}20` }}
                >
                  <ActivityIcon className="h-5 w-5" style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium dark:text-white">{activity.description}</p>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="mr-3">{formatTime(activity.timestamp)}</span>
                    {activity.location && (
                      <>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{activity.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </motion.div>
  )
}

