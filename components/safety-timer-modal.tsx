"use client"

import { useState, useEffect, useRef } from "react"
import { X, Clock, Bell, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface SafetyTimerModalProps {
  onClose: () => void
}

export function SafetyTimerModal({ onClose }: SafetyTimerModalProps) {
  const [stage, setStage] = useState<"setup" | "active" | "expired" | "completed">("setup")
  const [minutes, setMinutes] = useState(30)
  const [seconds, setSeconds] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [activity, setActivity] = useState("walking")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (stage === "active") {
      const totalSeconds = minutes * 60 + seconds
      setTimeLeft(totalSeconds)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStage("expired")
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [stage, minutes, seconds])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTimer = () => {
    setStage("active")
  }

  const handleExtendTime = () => {
    setTimeLeft((prev) => prev + 300) // Add 5 minutes
  }

  const handleCompleteTimer = () => {
    setStage("completed")
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (stage === "setup") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Safety Timer</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">I am</label>
              <Select defaultValue={activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="walking">Walking home</SelectItem>
                  <SelectItem value="transport">Using public transport</SelectItem>
                  <SelectItem value="meeting">Meeting someone new</SelectItem>
                  <SelectItem value="rideshare">Taking a rideshare</SelectItem>
                  <SelectItem value="other">Other activity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Timer Duration</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={minutes}
                    onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-center mt-1">Minutes</p>
                </div>
                <span className="text-2xl">:</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(Number.parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-center mt-1">Seconds</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-contacts" className="cursor-pointer flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-[#8A4FFF]" />
                  Notify contacts when timer expires
                </Label>
                <Switch id="notify-contacts" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="location-sharing" className="cursor-pointer flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-[#8A4FFF]" />
                  Share location during timer
                </Label>
                <Switch id="location-sharing" defaultChecked />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#8A4FFF] hover:bg-[#8A4FFF]/90"
                onClick={handleStartTimer}
                disabled={minutes === 0 && seconds === 0}
              >
                Start Timer
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (stage === "active") {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-between p-4 z-50">
        <div className="w-full pt-12 text-center">
          <h2 className="text-xl font-bold text-white">Safety Timer Active</h2>
          <p className="text-white/70">{activity}</p>
        </div>

        <div className="text-center">
          <div className="w-32 h-32 rounded-full bg-[#40E0D0]/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-16 w-16 text-[#40E0D0]" />
          </div>
          <div className="text-5xl font-bold text-white mb-4">{formatTime(timeLeft)}</div>
          <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleExtendTime}>
            + 5 Minutes
          </Button>
        </div>

        <div className="w-full">
          <div className="text-center text-white/70 mb-4">
            Your trusted contacts will be notified if the timer expires
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 border-white text-white hover:bg-white/10" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-[#36D986] hover:bg-[#36D986]/90" onClick={handleCompleteTimer}>
              I'm Safe
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (stage === "expired") {
    return (
      <div className="fixed inset-0 bg-[#FF5A5A] flex flex-col items-center justify-center p-4 z-50">
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Timer Expired</h2>
          <p className="text-white/80 mb-6">Your emergency contacts have been notified.</p>
          <Button className="bg-white text-[#FF5A5A] hover:bg-white/90" onClick={handleCompleteTimer}>
            I'm Safe Now
          </Button>
        </div>
      </div>
    )
  }

  if (stage === "completed") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#36D986]/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-[#36D986]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Timer Completed</h2>
          <p className="text-gray-500 mb-4">Your trusted contacts have been notified that you're safe.</p>
        </div>
      </div>
    )
  }

  return null
}

