"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Map, Phone, MessageSquare, Clock, Bell, Shield, AlertTriangle } from "lucide-react"
import { FakeCallModal } from "./fake-call-modal"
import { CheckInModal } from "./check-in-modal"
import { SafetyTimerModal } from "./safety-timer-modal"
import { motion } from "framer-motion"

export function QuickActions() {
  const router = useRouter()
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const safetyActions = [
    {
      icon: Users,
      label: "Circle of 3",
      color: "bg-[#8A4FFF]",
      action: () => router.push("/circle"),
    },
    {
      icon: Map,
      label: "Safe Routes",
      color: "bg-[#40E0D0]",
      action: () => router.push("/map"),
    },
    {
      icon: AlertTriangle,
      label: "Alerts",
      color: "bg-[#FF9D4D]",
      action: () => router.push("/alerts"),
    },
  ]

  const communicationActions = [
    {
      icon: Phone,
      label: "Fake Call",
      color: "bg-[#FF5A5A]",
      action: () => setActiveModal("fakeCall"),
    },
    {
      icon: MessageSquare,
      label: "Check In",
      color: "bg-[#8A4FFF]",
      action: () => setActiveModal("checkIn"),
    },
    {
      icon: Clock,
      label: "Timer",
      color: "bg-[#40E0D0]",
      action: () => setActiveModal("timer"),
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center dark:text-white">
            <Shield className="w-5 h-5 mr-2 text-[#8A4FFF]" />
            Safety Features
          </h2>
          <motion.div className="grid grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
            {safetyActions.map((action, index) => (
              <motion.div key={index} variants={item}>
                <ActionCard action={action} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3 flex items-center dark:text-white">
            <Bell className="w-5 h-5 mr-2 text-[#FF5A5A]" />
            Communication Tools
          </h2>
          <motion.div className="grid grid-cols-3 gap-4" variants={container} initial="hidden" animate="show">
            {communicationActions.map((action, index) => (
              <motion.div key={index} variants={item}>
                <ActionCard action={action} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {activeModal === "fakeCall" && <FakeCallModal onClose={() => setActiveModal(null)} />}
      {activeModal === "checkIn" && <CheckInModal onClose={() => setActiveModal(null)} />}
      {activeModal === "timer" && <SafetyTimerModal onClose={() => setActiveModal(null)} />}
    </>
  )
}

interface ActionProps {
  icon: any
  label: string
  color: string
  action: () => void
}

function ActionCard({ action }: { action: ActionProps }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Card
        className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 overflow-hidden"
        onClick={action.action}
      >
        <CardContent className="p-4 flex flex-col items-center">
          <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
            <action.icon className="text-white w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-center dark:text-white">{action.label}</span>
        </CardContent>
      </Card>
    </motion.div>
  )
}

