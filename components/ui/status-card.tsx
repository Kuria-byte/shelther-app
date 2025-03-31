"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, ChevronDown, AlertTriangle, AlertCircle } from "lucide-react"
import type { FeelingStatus } from "./feeling-status-toggle"

interface StatusCardProps {
  feelingStatus?: FeelingStatus
}

export function StatusCard({ feelingStatus = "safe" }: StatusCardProps) {
  const [showStatusDetails, setShowStatusDetails] = useState(false)

  const getStatusInfo = () => {
    switch (feelingStatus) {
      case "safe":
        return {
          title: "You're Safe",
          description: "Your location is being monitored",
          icon: Shield,
          gradient: "from-purple-600 to-teal-400",
          pulseAnimation: false,
        }
      case "cautious":
        return {
          title: "Cautious Mode Active",
          description: "Enhanced monitoring enabled",
          icon: AlertTriangle,
          gradient: "from-amber-500 to-orange-400",
          pulseAnimation: false,
        }
      case "help":
        return {
          title: "Stay Safe",
          description: "Help is on the way",
          icon: AlertCircle,
          gradient: "from-red-600 to-red-400",
          pulseAnimation: true,
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${statusInfo.gradient} text-white shadow-lg`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      layout
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-8 border-white opacity-20"></div>
      </div>

      {statusInfo.pulseAnimation && (
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-white rounded-2xl opacity-10"
            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      <div className="relative p-5 z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <statusInfo.icon className="h-6 w-6" />
            </div>
            <div>
              <motion.h3
                className="text-xl font-bold"
                key={statusInfo.title}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {statusInfo.title}
              </motion.h3>
              <motion.p
                className="text-sm text-white text-opacity-90"
                key={statusInfo.description}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {statusInfo.description}
              </motion.p>
            </div>
          </div>
          <button
            onClick={() => setShowStatusDetails(!showStatusDetails)}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-10"
          >
            <ChevronDown
              className={`h-5 w-5 transform transition-transform ${showStatusDetails ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {showStatusDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white border-opacity-20"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white text-opacity-80">Current Location</p>
                  <p className="font-medium">Nairobi, Kenya</p>
                </div>
                <div>
                  <p className="text-sm text-white text-opacity-80">Safety Rating</p>
                  <p className="font-medium">
                    {feelingStatus === "safe"
                      ? "High (92%)"
                      : feelingStatus === "cautious"
                        ? "Medium (68%)"
                        : "Low (35%)"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white text-opacity-80">Monitoring Since</p>
                  <p className="font-medium">2:30 PM</p>
                </div>
                <div>
                  <p className="text-sm text-white text-opacity-80">Battery Impact</p>
                  <p className="font-medium">
                    {feelingStatus === "safe"
                      ? "Low (2%/hr)"
                      : feelingStatus === "cautious"
                        ? "Medium (5%/hr)"
                        : "High (8%/hr)"}
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors font-medium">
                {feelingStatus === "help" ? "Contact Emergency Services" : "Adjust Monitoring Settings"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 w-full bg-white bg-opacity-20 h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-white h-full rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: feelingStatus === "safe" ? "85%" : feelingStatus === "cautious" ? "60%" : "30%",
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

