"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, X, Users, Bell, Check, AlertTriangle } from "lucide-react"

interface SafetyTimerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SafetyTimerModal({ isOpen, onClose }: SafetyTimerModalProps) {
  const [timerDuration, setTimerDuration] = useState(30)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [timerExpired, setTimerExpired] = useState(false)

  const contacts = [
    { id: "1", name: "Emma Johnson" },
    { id: "2", name: "Michael Chen" },
    { id: "3", name: "Sophia Rodriguez" },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isTimerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            setTimerExpired(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerActive, remainingTime])

  const toggleContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter((contactId) => contactId !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  const startTimer = () => {
    setRemainingTime(timerDuration * 60)
    setIsTimerActive(true)
  }

  const stopTimer = () => {
    setIsTimerActive(false)
    setRemainingTime(0)
    setTimerExpired(false)
  }

  const extendTimer = (minutes: number) => {
    setRemainingTime((prev) => prev + minutes * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleClose = () => {
    if (isTimerActive) {
      if (confirm("Are you sure you want to cancel the active timer?")) {
        stopTimer()
        onClose()
      }
    } else {
      onClose()
    }
  }

  const handleCheckIn = () => {
    stopTimer()
    // In a real app, we would send a check-in to the server
    console.log("User checked in as safe")

    // Show success message briefly before closing
    setTimeout(() => {
      onClose()
    }, 2000)
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
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
                <Clock className="h-4 w-4 text-teal-500 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {isTimerActive ? "Safety Timer Active" : "Set Safety Timer"}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {timerExpired ? (
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Timer Expired</h4>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                Your trusted contacts have been notified. Are you safe?
              </p>
              <button
                onClick={handleCheckIn}
                className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center justify-center"
              >
                <Check className="h-5 w-5 mr-2" />
                I'm Safe
              </button>
            </div>
          ) : isTimerActive ? (
            <div className="p-4 space-y-4">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2 font-mono">
                  {formatTime(remainingTime)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your contacts will be notified if you don't check in before the timer expires.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => extendTimer(5)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  +5 min
                </button>
                <button
                  onClick={() => extendTimer(15)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  +15 min
                </button>
                <button
                  onClick={() => extendTimer(30)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm"
                >
                  +30 min
                </button>
              </div>

              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-800 dark:text-teal-200 text-sm">
                <p className="font-medium">Contacts who will be notified:</p>
                <ul className="mt-1 ml-4 list-disc">
                  {selectedContacts.map((id) => (
                    <li key={id}>{contacts.find((c) => c.id === id)?.name}</li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleCheckIn}
                  className="flex-1 py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 flex items-center justify-center"
                >
                  <Check className="h-5 w-5 mr-2" />
                  I'm Safe
                </button>
                <button
                  onClick={stopTimer}
                  className="flex-1 py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center justify-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel Timer
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Timer Duration (minutes)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    id="duration"
                    min="5"
                    max="120"
                    step="5"
                    value={timerDuration}
                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-3 w-12 text-center text-gray-700 dark:text-gray-300">{timerDuration}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => setTimerDuration(15)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    15m
                  </button>
                  <button
                    onClick={() => setTimerDuration(30)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    30m
                  </button>
                  <button
                    onClick={() => setTimerDuration(60)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    1h
                  </button>
                  <button
                    onClick={() => setTimerDuration(120)}
                    className="px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    2h
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notify these contacts if you don't check in
                </label>
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`flex items-center p-2 rounded-lg border transition-colors cursor-pointer ${
                        selectedContacts.includes(contact.id)
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/30"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => toggleContact(contact.id)}
                    >
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
                        <Users className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">{contact.name}</span>
                      {selectedContacts.includes(contact.id) && (
                        <Check className="h-4 w-4 text-teal-500 dark:text-teal-400 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-800 dark:text-teal-200 text-sm">
                <p>
                  If you don't check in before the timer expires, your selected contacts will be notified and can see
                  your location.
                </p>
              </div>

              <button
                onClick={startTimer}
                disabled={selectedContacts.length === 0}
                className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Bell className="h-5 w-5 mr-2" />
                Start Safety Timer
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

