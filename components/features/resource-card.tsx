"use client"

import { motion } from "framer-motion"
import { type LucideIcon, ExternalLink } from "lucide-react"

interface ResourceCardProps {
  title: string
  description: string
  icon: LucideIcon
  url: string
  bgColor: string
  darkBgColor: string
  textColor: string
  darkTextColor: string
}

export function ResourceCard({
  title,
  description,
  icon: Icon,
  url,
  bgColor,
  darkBgColor,
  textColor,
  darkTextColor,
}: ResourceCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm block"
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
          <div className="flex justify-between">
            <h4 className="text-base font-medium text-gray-800 dark:text-white">{title}</h4>
            <ExternalLink className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </motion.a>
  )
}

