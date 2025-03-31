"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Phone, X, Volume2, Mic, MicOff, VolumeX } from "lucide-react"

interface CallModalProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: number
    name: string
    avatar: string
  }
}

export function CallModal({ isOpen, onClose, contact }: CallModalProps) {
  const [callStatus, setCallStatus] = useState<"dialing" | "connected" | "ended">("dialing")
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let connectionTimer: NodeJS.Timeout

    if (isOpen && callStatus === "dialing") {
      // Simulate call connecting after 2 seconds
      connectionTimer = setTimeout(() => {
        setCallStatus("connected")

        // Vibrate if supported
        if (navigator.vibrate) {
          navigator.vibrate(200)
        }
      }, 2000)
    }

    if (callStatus === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
      if (connectionTimer) clearTimeout(connectionTimer)
    }
  }, [isOpen, callStatus])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const endCall = () => {
    setCallStatus("ended")
    setTimeout(() => {
      onClose()
      // Reset state for next call
      setCallStatus("dialing")
      setCallDuration(0)
      setIsMuted(false)
      setIsSpeakerOn(false)
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
              <img
                src={contact.avatar || "/placeholder.svg"}
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{contact.name}</h3>

            {callStatus === "dialing" ? (
              <p className="text-gray-500 dark:text-gray-400">Calling...</p>
            ) : callStatus === "connected" ? (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <p className="text-gray-500 dark:text-gray-400">{formatTime(callDuration)}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Call ended</p>
            )}

            {callStatus === "connected" && (
              <div className="grid grid-cols-3 gap-4 w-full mt-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-4 rounded-full ${isMuted ? "bg-red-100 dark:bg-red-900 text-red-500 dark:text-red-400" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} flex items-center justify-center`}
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-4 rounded-full ${isSpeakerOn ? "bg-purple-100 dark:bg-purple-900 text-purple-500 dark:text-purple-400" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} flex items-center justify-center`}
                >
                  {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                </button>
                <button className="p-4 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            )}

            <button
              onClick={endCall}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mt-4"
            >
              <Phone className="h-8 w-8 text-white transform rotate-135" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

