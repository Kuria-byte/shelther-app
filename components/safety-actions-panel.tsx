"use client"

import { MapPin, Phone, Navigation, Share2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface SafetyActionsPanelProps {
  onActionSelect: (action: string) => void
}

export function SafetyActionsPanel({ onActionSelect }: SafetyActionsPanelProps) {
  const actions = [
    {
      id: "share-location",
      icon: Share2,
      label: "Share Location with Circle",
      description: "Let trusted contacts track your location",
    },
    {
      id: "journey-monitoring",
      icon: MapPin,
      label: "Start Journey Monitoring",
      description: "Automatic check-ins and tracking",
    },
    {
      id: "safety-call",
      icon: Phone,
      label: "Safety Call",
      description: "Receive a simulated call now",
    },
    {
      id: "safe-route",
      icon: Navigation,
      label: "Get Safe Route",
      description: "Find nearest safe location",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-3"
    >
      {actions.map((action, index) => (
        <motion.div
          key={action.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full flex items-center p-4 bg-white dark:bg-gray-800"
            onClick={() => onActionSelect(action.id)}
          >
            <div className="w-10 h-10 rounded-full bg-[#8A4FFF]/10 flex items-center justify-center mr-3">
              <action.icon className="h-5 w-5 text-[#8A4FFF]" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">{action.label}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {action.description}
              </p>
            </div>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  )
}
