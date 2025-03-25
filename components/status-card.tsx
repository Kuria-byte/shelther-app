"use client"

import { useState, useEffect } from "react"
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

type StatusType = "safe" | "cautious" | "danger"

interface StatusCardProps {
  status: StatusType
}

export function StatusCard({ status }: StatusCardProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    // Trigger animation periodically for the safe status
    if (status === "safe") {
      const interval = setInterval(() => {
        setAnimate(true)
        setTimeout(() => setAnimate(false), 1000)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [status])

  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case "safe":
        return {
          icon: Shield,
          gradient: "bg-gradient-to-r from-[#8A4FFF] to-[#40E0D0]",
          iconColor: "text-white",
          title: "You're Safe",
          description: "Your location is being monitored",
        }
      case "cautious":
        return {
          icon: AlertTriangle,
          gradient: "bg-gradient-to-r from-[#FF9D4D] to-[#FFD166]",
          iconColor: "text-white",
          title: "Cautious Mode Active",
          description: "Enhanced monitoring enabled",
          pulseAnimation: true,
        }
      case "danger":
        return {
          icon: AlertOctagon,
          gradient: "bg-gradient-to-r from-[#FF3B3B] to-[#FF5757]",
          iconColor: "text-white",
          title: "Emergency Mode Active",
          description: "Emergency services coordinating response",
          pulseAnimation: true,
          expandCard: true,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: config.expandCard ? 1.05 : 1 
        }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full rounded-2xl overflow-hidden border-none shadow-lg dark:bg-gray-800">
          <CardContent className="p-0">
            <motion.div 
              className={`${config.gradient} p-6`}
              animate={{
                background: config.gradient,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center">
                <motion.div
                  className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mr-4"
                  animate={animate ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1 }}
                >
                  <config.icon className={`${config.iconColor} w-7 h-7`} />
                </motion.div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{config.title}</h2>
                  <p className="text-white/80">{config.description}</p>
                </div>
              </div>

              {status === "safe" && (
                <div className="mt-4 flex items-center">
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        ease: "linear",
                      }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

