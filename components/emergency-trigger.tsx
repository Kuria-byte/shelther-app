"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EmergencyTriggerProps {
  onActivate: () => void
}

export function EmergencyTrigger({ onActivate }: EmergencyTriggerProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)

  const triggerHapticFeedback = (duration: number) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent any default behavior
    console.log('Tap detected'); // Debug log

    if (!isActivated) {
      console.log('Activating emergency...'); // Debug log
      setIsActivated(true);
      setIsPulsing(false);
      triggerHapticFeedback(400);
      onActivate();
    }
  }

  return (
    <div className="mt-12 mb-8 flex justify-center items-center">
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing ring - only shows when not activated */}
        <AnimatePresence>
          {!isActivated && isPulsing && (
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

        {/* Main button container */}
        <motion.div
          className={`w-36 h-36 rounded-full ${
            isActivated ? "bg-red-600" : "bg-[#FF5A5A]/10"
          } flex items-center justify-center`}
          animate={{
            scale: isActivated ? 0.95 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {/* Middle ring */}
          <div className={`w-28 h-28 rounded-full ${
            isActivated ? "bg-red-500" : "bg-gradient-to-br from-[#FF5A5A] to-[#FF8080]"
          } flex items-center justify-center`}>
            
            {/* Inner button */}
            <motion.button
              className={`w-24 h-24 rounded-full ${
                isActivated ? "bg-red-600 text-white" : "bg-white text-[#FF5A5A]"
              } font-bold shadow-lg flex flex-col items-center justify-center focus:outline-none 
              active:scale-95 cursor-pointer select-none touch-none`} // Added interactive classes
              onClick={handleTap}
              onTouchEnd={handleTap}
              disabled={isActivated}
              aria-label="Emergency trigger button"
            >
              {isActivated ? (
                <>
                  <span className="text-sm uppercase tracking-wider">Emergency</span>
                  <span className="text-sm uppercase tracking-wider">Active</span>
                </>
              ) : (
                <>
                  <span className="text-xs uppercase tracking-wider">Tap for</span>
                  <span className="text-xs uppercase tracking-wider mt-1">Emergency</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Activation flash effect */}
        <AnimatePresence>
          {isActivated && (
            <motion.div
              className="absolute w-44 h-44 rounded-full bg-red-500"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

