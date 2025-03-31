"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, X, Users } from "lucide-react"

interface JourneyTrackerProps {
  onClose: () => void
}

export function JourneyTracker({ onClose }: JourneyTrackerProps) {
  const [destination, setDestination] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("30")
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])

  const contacts = [
    { id: "1", name: "Emma Johnson" },
    { id: "2", name: "Michael Chen" },
    { id: "3", name: "Sophia Rodriguez" },
  ]

  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  const handleStartJourney = () => {
    // In a real app, we would start the journey tracking here
    console.log("Starting journey to:", destination)
    console.log("Estimated time:", estimatedTime, "minutes")
    console.log("Sharing with contacts:", selectedContacts)
    onClose()
  }

  return (
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
            <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
              <MapPin className="h-4 w-4 text-teal-500 dark:text-teal-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Track My Journey</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Where are you going?
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Estimated arrival time
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="time"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                min="5"
                max="180"
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">minutes</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Share journey with
            </label>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center p-2 rounded-lg border transition-colors ${
                    selectedContacts.includes(contact.id)
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => toggleContact(contact.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                    <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-800 dark:text-white">{contact.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-800 dark:text-teal-200 text-sm">
            <p>
              Your contacts will be notified if you don't arrive within the estimated time. They'll be able to see your
              location during the journey.
            </p>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleStartJourney}
              disabled={!destination || selectedContacts.length === 0}
              className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Journey
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

