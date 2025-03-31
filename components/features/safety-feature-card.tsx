"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface SafetyFeatureCardProps {
  icon: LucideIcon
  title: string
  bgColor: string
  darkBgColor: string
  textColor: string
  darkTextColor: string
  onClick: () => void
}

export function SafetyFeatureCard({
  icon: Icon,
  title,
  bgColor,
  darkBgColor,
  textColor,
  darkTextColor,
  onClick,
}: SafetyFeatureCardProps) {
  return (
    <motion.button
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className={`w-12 h-12 rounded-full ${bgColor} ${darkBgColor} flex items-center justify-center mb-2`}>
        <Icon className={`h-6 w-6 ${textColor} ${darkTextColor}`} />
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-white text-center">{title}</span>
    </motion.button>
  )
}

