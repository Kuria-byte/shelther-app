"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, AlertTriangle, AlertCircle, X, Mic, ChevronDown, MapPin } from "lucide-react"

export type FeelingStatus = "safe" | "cautious" | "help"

interface FeelingStatusToggleProps {
  initialStatus?: FeelingStatus
  onStatusChange?: (status: FeelingStatus) => void
}

export function FeelingStatusToggle({ initialStatus = "safe", onStatusChange }: FeelingStatusToggleProps) {
  const [status, setStatus] = useState<FeelingStatus>(initialStatus)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedContext, setSelectedContext] = useState<string | null>(null)
  const [locationSharing, setLocationSharing] = useState(true)

  const getStatusInfo = () => {
    switch (status) {
      case "safe":
        return {
          label: "I Feel Safe",
          icon: Shield,
          bgColor: "bg-green-100",
          darkBgColor: "dark:bg-green-900",
          textColor: "text-green-500",
          darkTextColor: "dark:text-green-400",
          cardGradient: "from-purple-600 to-teal-400",
        }
      case "cautious":
        return {
          label: "Feeling Cautious",
          icon: AlertTriangle,
          bgColor: "bg-amber-100",
          darkBgColor: "dark:bg-amber-900",
          textColor: "text-amber-500",
          darkTextColor: "dark:text-amber-400",
          cardGradient: "from-amber-500 to-orange-400",
        }
      case "help":
        return {
          label: "Need Help",
          icon: AlertCircle,
          bgColor: "bg-red-100",
          darkBgColor: "dark:bg-red-900",
          textColor: "text-red-500",
          darkTextColor: "dark:text-red-400",
          cardGradient: "from-red-600 to-red-400",
        }
    }
  }

  const statusInfo = getStatusInfo()

  const handleStatusChange = (newStatus: FeelingStatus) => {
    setStatus(newStatus)
    if (onStatusChange) {
      onStatusChange(newStatus)
    }

    if (newStatus === "cautious") {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
      setSelectedContext(null)
    }
  }

  const commonScenarios = [
    { id: "followed", label: "Being followed" },
    { id: "uncomfortable", label: "Uncomfortable situation" },
    { id: "unfamiliar", label: "Unfamiliar area" },
    { id: "transport", label: "Public transport concern" },
    { id: "night", label: "Walking at night" },
  ]

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // In a real app, we would start/stop recording here
  }

  const handleCloseModal = () => {
    console.log("Closing modal")
    setSelectedContext(null)
    setIsModalOpen(false)
  }

  return (
    <>
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full ${statusInfo.bgColor} ${statusInfo.darkBgColor} flex items-center justify-center mr-3`}
            >
              <statusInfo.icon className={`h-5 w-5 ${statusInfo.textColor} ${statusInfo.darkTextColor}`} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">How are you feeling?</h3>
              <p className="text-base font-semibold text-gray-800 dark:text-white">{statusInfo.label}</p>
            </div>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Status Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">How are you feeling?</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {/* Safe Option */}
                  <button
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      status === "safe"
                        ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => handleStatusChange("safe")}
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                      <Shield className="h-5 w-5 text-green-500 dark:text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">I Feel Safe</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Everything is fine</p>
                    </div>
                  </button>

                  {/* Cautious Option */}
                  <button
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      status === "cautious"
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => handleStatusChange("cautious")}
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">Feeling Cautious</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Minor concern or discomfort</p>
                    </div>
                  </button>

                  {/* Help Option */}
                  <button
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      status === "help"
                        ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => handleStatusChange("help")}
                  >
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                      <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-white">Need Help</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Urgent situation</p>
                    </div>
                  </button>
                </div>

                {status === "help" && (
                  <div className="p-3 mb-4 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-200 text-sm">
                    <p className="font-medium">This will alert your trusted contacts</p>
                    <p>They will be notified of your status and current location.</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                      status === "safe"
                        ? "bg-green-600 hover:bg-green-700"
                        : status === "cautious"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Collection Panel for Cautious State */}
      <AnimatePresence>
        {status === "cautious" && !isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">What's happening?</h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Select what's happening or record a voice note
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {commonScenarios.map((scenario) => (
                      <button
                        key={scenario.id}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedContext === scenario.id
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                            : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setSelectedContext(scenario.id)}
                      >
                        {scenario.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 pb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      onClick={toggleRecording}
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Add voice note</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Share location</span>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-location"
                        className="sr-only"
                        checked={locationSharing}
                        onChange={() => setLocationSharing(!locationSharing)}
                      />
                      <label
                        htmlFor="toggle-location"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${locationSharing ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${locationSharing ? "translate-x-6" : ""}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="p-3 mb-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
                  <p>
                    Your location is being monitored. Your trusted contacts will be notified if you don't check in
                    within 30 minutes.
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                >
                  Confirm Status
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

