"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmergencyActivationProps {
  onConfirm: () => void
  onCancel: () => void
}

export function EmergencyActivation({ onConfirm, onCancel }: EmergencyActivationProps) {
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onConfirm()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onConfirm])

  return (
    <div className="fixed inset-0 bg-[#FF5A5A] flex flex-col items-center justify-center p-6 z-50">
      <button onClick={onCancel} className="absolute top-6 right-6 bg-white/20 rounded-full p-2">
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Emergency Activating</h1>
        <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-white text-6xl font-bold mb-8">
          {countdown}
        </div>
        <p className="text-white text-xl mb-8">Your emergency contacts will be notified in {countdown} seconds</p>
        <Button
          onClick={onCancel}
          className="bg-white text-[#FF5A5A] hover:bg-white/90 font-semibold text-lg py-6 px-8 rounded-full"
        >
          Cancel Emergency
        </Button>
      </div>
    </div>
  )
}

