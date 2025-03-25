"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ChevronLeft, MapPin, Users, Bell } from "lucide-react"

interface PermissionsScreenProps {
  step: number // 1-3 for the different permission screens
}

export function PermissionsScreen({ step }: PermissionsScreenProps) {
  const { nextStep, prevStep, totalSteps } = useOnboarding()
  const [granted, setGranted] = useState(false)

  const permissions = [
    {
      icon: MapPin,
      title: "Location Access",
      description: "Shelther needs your location to alert your trusted contacts where you are in case of emergency.",
      color: "#8A4FFF",
      buttonText: "Allow Location Access",
    },
    {
      icon: Users,
      title: "Contacts Access",
      description: "We need access to your contacts so you can easily add trusted people to your Circle of 3.",
      color: "#40E0D0",
      buttonText: "Allow Contacts Access",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Enable notifications to receive safety alerts and updates from your trusted contacts.",
      color: "#FF9D4D",
      buttonText: "Allow Notifications",
    },
  ]

  const currentPermission = permissions[step - 1]

  const handleGrantPermission = () => {
    // In a real app, this would request the actual permission
    setGranted(true)
    setTimeout(() => {
      nextStep()
      setGranted(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={prevStep}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-gray-500">
          {step + 5} of {totalSteps}
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: `${currentPermission.color}20` }}
        >
          <currentPermission.icon className="w-20 h-20" style={{ color: currentPermission.color }} />
        </div>

        <h1 className="text-3xl font-bold mb-4">{currentPermission.title}</h1>
        <p className="text-gray-600 max-w-md mb-8">{currentPermission.description}</p>
      </div>

      <Button
        onClick={handleGrantPermission}
        className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90"
        disabled={granted}
      >
        {granted ? "Permission Granted" : currentPermission.buttonText}
      </Button>
    </div>
  )
}

