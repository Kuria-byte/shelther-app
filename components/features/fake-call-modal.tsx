"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X, Clock, Volume2 } from "lucide-react"

interface FakeCallModalProps {
  onClose: () => void
  isOpen: boolean
}

export function FakeCallModal({ onClose, isOpen }: FakeCallModalProps) {
  const [callStage, setCallStage] = useState<"incoming" | "active" | "ended">("incoming")
  const [callTimer, setCallTimer] = useState(0)
  const [callerName, setCallerName] = useState("Mom")
  const [delayTime, setDelayTime] = useState(30)
  const [isConfiguring, setIsConfiguring] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (callStage === "active") {
      timer = setInterval(() => {
        setCallTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [callStage])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const startFakeCall = () => {
    setIsConfiguring(false)

    // Schedule the call after the delay
    setTimeout(() => {
      setCallStage("incoming")
      // Vibrate if supported
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }
    }, delayTime * 1000)
  }

  const answerCall = () => {
    setCallStage("active")
  }

  const endCall = () => {
    setCallStage("ended")
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isConfiguring ? (
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
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                  <Phone className="h-4 w-4 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Schedule Fake Call</h3>
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
                <label htmlFor="caller" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Caller Name
                </label>
                <input
                  type="text"
                  id="caller"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="Enter caller name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="delay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Call in
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    id="delay"
                    value={delayTime}
                    onChange={(e) => setDelayTime(Number(e.target.value))}
                    min="5"
                    max="120"
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <span className="ml-2 text-gray-700 dark:text-gray-300">seconds</span>
                </div>
              </div>

              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-200 text-sm">
                <p>Your phone will ring after the specified delay. This can help you exit uncomfortable situations.</p>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={startFakeCall}
                  className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : callStage === "incoming" ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {callerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{callerName}</h3>
              <p className="text-gray-500 dark:text-gray-400">Incoming call...</p>

              <div className="flex w-full justify-between mt-8">
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center"
                >
                  <Phone className="h-8 w-8 text-white transform rotate-135" />
                </button>
                <button
                  onClick={answerCall}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center"
                >
                  <Phone className="h-8 w-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : callStage === "active" ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                  {callerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{callerName}</h3>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                <p className="text-gray-500 dark:text-gray-400">{formatTime(callTimer)}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <button className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Volume2 className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mt-4"
              >
                <Phone className="h-8 w-8 text-white transform rotate-135" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

