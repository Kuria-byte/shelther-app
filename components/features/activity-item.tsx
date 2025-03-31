"use client"

import { motion } from "framer-motion"
import { type LucideIcon, MapPin } from "lucide-react"

interface ActivityItemProps {
  icon: LucideIcon
  title: string
  time: string
  location?: string
  bgColor: string
  darkBgColor: string
  textColor: string
  darkTextColor: string
}

export function ActivityItem({
  icon: Icon,
  title,
  time,
  location,
  bgColor,
  darkBgColor,
  textColor,
  darkTextColor,
}: ActivityItemProps) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex">
        <div className="mr-3">
          <div className={`w-10 h-10 rounded-full ${bgColor} ${darkBgColor} flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${textColor} ${darkTextColor}`} />
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-base font-medium text-gray-800 dark:text-white">{title}</h4>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="mr-2">{time}</span>
            {location && (
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {location}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

