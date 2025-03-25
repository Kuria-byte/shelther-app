"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mic, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Switch } from "./ui/switch"

interface ContextCollectionPanelProps {
  onClose: () => void
  onContextSubmit: (context: {
    scenario: string
    voiceNote?: Blob
    location: boolean
  }) => void
}

export function ContextCollectionPanel({
  onClose,
  onContextSubmit
}: ContextCollectionPanelProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>("")
  const [isRecording, setIsRecording] = useState(false)
  const [shareLocation, setShareLocation] = useState(true)

  const scenarios = [
    { id: "followed", label: "Being followed" },
    { id: "uncomfortable", label: "Uncomfortable situation" },
    { id: "unfamiliar", label: "Unfamiliar area" },
    { id: "other", label: "Other concern" }
  ]

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-lg z-50"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">What's happening?</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-3 mb-6">
          {scenarios.map((scenario) => (
            <Button
              key={scenario.id}
              variant={selectedScenario === scenario.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedScenario(scenario.id)}
            >
              {scenario.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className={isRecording ? "bg-red-100 text-red-600" : ""}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isRecording ? "Recording..." : "Add voice note"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Share location
            </span>
            <Switch
              checked={shareLocation}
              onCheckedChange={setShareLocation}
            />
          </div>
        </div>

        <Button 
          className="w-full bg-[#8A4FFF]"
          onClick={() => onContextSubmit({
            scenario: selectedScenario,
            location: shareLocation
          })}
        >
          Confirm Status
        </Button>
      </div>
    </motion.div>
  )
}
