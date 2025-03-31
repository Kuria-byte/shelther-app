"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, X, Check, Home, Briefcase, Coffee, MapIcon, Navigation } from "lucide-react"

interface CheckInModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [customLocation, setCustomLocation] = useState("")
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const predefinedLocations = [
    { id: "home", name: "Home", icon: Home },
    { id: "work", name: "Work", icon: Briefcase },
    { id: "cafe", name: "Cafe", icon: Coffee },
  ]

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Close modal after showing success message
      setTimeout(() => {
        onClose()
        setIsSuccess(false)
        setSelectedLocation(null)
        setCustomLocation("")
        setNote("")
      }, 2000)
    }, 1500)
  }

  const handleUseCurrentLocation = () => {
    // In a real app, we would use the Geolocation API
    setSelectedLocation("current")
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                <MapPin className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Check In</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {isSuccess ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Check-In Successful</h4>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Your trusted contacts have been notified that you're safe.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where are you?
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {predefinedLocations.map((location) => (
                    <button
                      key={location.id}
                      className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-colors ${
                        selectedLocation === location.id
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => setSelectedLocation(location.id)}
                    >
                      <location.icon className="h-5 w-5 mb-1" />
                      <span className="text-sm">{location.name}</span>
                    </button>
                  ))}
                </div>

                <button
                  className={`w-full p-3 rounded-lg border flex items-center justify-center mb-3 transition-colors ${
                    selectedLocation === "current"
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={handleUseCurrentLocation}
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  <span>Use Current Location</span>
                </button>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Or enter a custom location"
                    value={customLocation}
                    onChange={(e) => {
                      setCustomLocation(e.target.value)
                      if (e.target.value) {
                        setSelectedLocation("custom")
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-10"
                  />
                  <MapIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Add a note (optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  placeholder="I'm at the library studying..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-800 dark:text-purple-200 text-sm">
                <p>Your trusted contacts will be notified that you've checked in safely.</p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!selectedLocation || isSubmitting}
                className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking In...
                  </>
                ) : (
                  "Check In as Safe"
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

