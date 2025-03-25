"use client"

import { useState, useEffect } from "react"
import { User, Phone, MessageSquare, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmergencyActiveProps {
  onResolve: () => void
}

export function EmergencyActive({ onResolve }: EmergencyActiveProps) {
  const [elapsedTime, setElapsedTime] = useState(0)

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const contacts = [
    { name: "Mom", status: "Notified", icon: Phone },
    { name: "Sister", status: "Responding", icon: MessageSquare },
    { name: "Friend", status: "Tracking", icon: MapPin },
  ]

  return (
    <div className="fixed inset-0 bg-[#FF5A5A] flex flex-col p-6 z-50">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">Emergency Active</h1>
        <p className="text-white/80">Time elapsed: {formatTime(elapsedTime)}</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 mb-6">
        <h2 className="text-white text-xl font-semibold mb-4">Location</h2>
        <div className="bg-gray-800/30 rounded-xl h-40 flex items-center justify-center mb-2">
          <MapPin className="w-8 h-8 text-white/70" />
          <span className="text-white/70 ml-2">Map View</span>
        </div>
        <p className="text-white/80 text-sm">123 Main Street, Anytown, USA</p>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 mb-auto">
        <h2 className="text-white text-xl font-semibold mb-4">Circle of 3 Status</h2>
        <div className="space-y-3">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center bg-white/10 rounded-xl p-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{contact.name}</h3>
                <div className="flex items-center">
                  <contact.icon className="w-4 h-4 text-white/70 mr-1" />
                  <span className="text-white/70 text-sm">{contact.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onResolve}
        className="bg-white text-[#FF5A5A] hover:bg-white/90 font-semibold text-lg py-6 rounded-full mt-4"
      >
        I'm Safe Now
      </Button>
    </div>
  )
}

