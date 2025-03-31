"use client"

import { motion } from "framer-motion"

export function EmergencyButton() {
  return (
    <div className="mt-8 mb-20">
      <div className="flex justify-center">
        <motion.button
          className="relative flex items-center justify-center w-20 h-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-0 bg-red-500 rounded-full"></div>
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <span className="text-red-500 text-xs font-bold">HOLD FOR</span>
              <span className="text-red-500 text-xs font-bold">EMERGENCY</span>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

