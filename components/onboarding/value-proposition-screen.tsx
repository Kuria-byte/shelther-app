"use client"

import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ChevronLeft, AlertOctagon, Users, Navigation, Sliders } from "lucide-react"

interface ValuePropositionScreenProps {
  step: number // 1-4 for the different value proposition screens
}

export function ValuePropositionScreen({ step }: ValuePropositionScreenProps) {
  const { nextStep, prevStep, totalSteps } = useOnboarding()

  const screens = [
    {
      icon: AlertOctagon,
      title: "Emergency Help",
      description:
        "Quickly activate emergency mode with customizable triggers. Alert your trusted contacts with your location in seconds.",
      color: "#FF5A5A",
    },
    {
      icon: Users,
      title: "Circle of 3",
      description:
        "Add up to three trusted contacts who will be notified in case of emergency with your real-time location.",
      color: "#8A4FFF",
    },
    {
      icon: Navigation,
      title: "Journey Monitoring",
      description:
        "Share your route with trusted contacts when traveling. Get alerts about unsafe areas along your path.",
      color: "#40E0D0",
    },
    {
      icon: Sliders,
      title: "Customizable Safety",
      description:
        "Personalize triggers, alerts, and safety features to match your lifestyle and specific safety concerns.",
      color: "#FF9D4D",
    },
  ]

  const currentScreen = screens[step - 1]

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={prevStep}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-gray-500">
          {step + 1} of {totalSteps}
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div
          className="w-40 h-40 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: `${currentScreen.color}20` }}
        >
          <currentScreen.icon className="w-20 h-20" style={{ color: currentScreen.color }} />
        </div>

        <h1 className="text-3xl font-bold mb-4">{currentScreen.title}</h1>
        <p className="text-gray-600 max-w-md mb-8">{currentScreen.description}</p>

        <div className="flex space-x-2 mb-8">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index + 1 === step ? "bg-[#8A4FFF]" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      <Button onClick={nextStep} className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
        Next
      </Button>
    </div>
  )
}

