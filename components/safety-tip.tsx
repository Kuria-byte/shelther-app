"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

export function SafetyTip() {
  const [currentTip, setCurrentTip] = useState<number>(0)

  const tips = [
    "Always let someone know where you're going and when you expect to return.",
    "Trust your instincts. If something feels wrong, it probably is.",
    "Keep your phone charged and easily accessible at all times.",
    "Avoid walking alone at night in unfamiliar or poorly lit areas.",
    "When using rideshare services, always verify the driver and car details before getting in.",
    "Set up regular check-ins with friends or family during nights out.",
    "Be aware of your surroundings and limit distractions like headphones or looking at your phone.",
    "Have emergency contacts on speed dial or easily accessible on your phone.",
  ]

  // Change tip every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 30000)

    return () => clearInterval(interval)
  }, [tips.length])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mb-6"
    >
      <Card className="border-none shadow-sm dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="w-10 h-10 rounded-full bg-[#FF9D4D]/10 flex items-center justify-center mr-3 shrink-0">
              <Lightbulb className="h-5 w-5 text-[#FF9D4D]" />
            </div>
            <div>
              <h3 className="font-medium dark:text-white">Safety Tip</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{tips[currentTip]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

