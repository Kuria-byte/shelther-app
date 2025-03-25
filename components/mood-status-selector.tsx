"use client"

import type React from "react"

import { useState } from "react"
import { useUser, type MoodStatus } from "@/contexts/user-context"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react"
import { motion } from "framer-motion"

export function MoodStatusSelector() {
  const { user, setMoodStatus } = useUser()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  const statusOptions: { value: MoodStatus; label: string; icon: any; color: string }[] = [
    { value: "safe", label: "I Feel Safe", icon: Shield, color: "#36D986" },
    { value: "cautious", label: "Feeling Cautious", icon: AlertTriangle, color: "#FF9D4D" },
    { value: "unsafe", label: "I Feel Unsafe", icon: AlertOctagon, color: "#FF5A5A" },
  ]

  const currentStatus = statusOptions.find((option) => option.value === user.moodStatus) || statusOptions[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mb-6"
    >
      <Card className="border-none shadow-sm dark:bg-gray-800 overflow-hidden" onClick={() => setIsOpen(!isOpen)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: `${currentStatus.color}20` }}
              >
                <currentStatus.icon className="h-5 w-5" style={{ color: currentStatus.color }} />
              </div>
              <div>
                <h3 className="font-medium dark:text-white">How are you feeling?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentStatus.label}</p>
              </div>
            </div>
            <div className="text-gray-400">
              {isOpen ? (
                <motion.div initial={{ rotate: 0 }} animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                  <ChevronUp className="h-5 w-5" />
                </motion.div>
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>

          {isOpen && (
            <motion.div
              className="mt-4 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center p-2 rounded-lg cursor-pointer ${
                    user.moodStatus === option.value ? "bg-gray-100 dark:bg-gray-700" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setMoodStatus(option.value)
                    setIsOpen(false)
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${option.color}20` }}
                  >
                    <option.icon className="h-4 w-4" style={{ color: option.color }} />
                  </div>
                  <span className="dark:text-white">{option.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function ChevronUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

