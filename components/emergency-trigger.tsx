"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmergencyTriggerProps {
  onActivate: () => void
}

export function EmergencyTrigger({ onActivate }: EmergencyTriggerProps) {
  const [pressing, setPressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const HOLD_DURATION = 2000 // 2 seconds to activate

  // Add a gentle pulsing effect when not pressing
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    // Only pulse when not being pressed
    if (!pressing) {
      setIsPulsing(true)
    } else {
      setIsPulsing(false)
    }
  }, [pressing])

  const handlePressStart = () => {
    setPressing(true)
    setProgress(0)

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (HOLD_DURATION / 100)
        if (newProgress >= 100) {
          if (timerRef.current) clearInterval(timerRef.current)
          onActivate()
          return 100
        }
        return newProgress
      })
    }, 100)
  }

  const handlePressEnd = () => {
    setPressing(false)
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div className="mt-12 mb-8 flex justify-center items-center">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring - only shows when not pressing */}
        <AnimatePresence>
          {isPulsing && (
            <motion.div
              className="absolute w-44 h-44 rounded-full bg-[#FF5A5A]/10"
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1.05, opacity: 0.2 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                duration: 2,
                ease: "easeInOut",
              }}
            />
          )}
        </AnimatePresence>

        {/* Animated outer ring */}
        <motion.div
          className={`w-36 h-36 rounded-full ${
            pressing ? "bg-[#FF5A5A]/20" : "bg-[#FF5A5A]/10"
          } flex items-center justify-center`}
          animate={{
            scale: pressing ? 0.95 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Middle ring - gradient */}
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF5A5A] to-[#FF8080] flex items-center justify-center">
            {/* Progress ring */}
            <svg className="absolute w-28 h-28">
              <circle
                cx="56"
                cy="56"
                r="54"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${progress * 3.39} 339`}
                strokeLinecap="round"
                transform="rotate(-90 56 56)"
              />
            </svg>

            {/* Inner button */}
            <motion.button
              className="w-24 h-24 rounded-full bg-white text-[#FF5A5A] font-bold shadow-lg flex flex-col items-center justify-center focus:outline-none"
              whileTap={{ scale: 0.95 }}
              onTouchStart={handlePressStart}
              onTouchEnd={handlePressEnd}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onMouseLeave={handlePressEnd}
              aria-label="Emergency trigger button"
            >
              <span className="text-xs uppercase tracking-wider">Hold for</span>
              <span className="text-xs uppercase tracking-wider mt-1">Emergency</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pulsing effect when pressing */}
        <AnimatePresence>
          {pressing && (
            <motion.div
              className="absolute w-44 h-44 rounded-full border-2 border-[#FF5A5A]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

