"use client"

import { useState, useEffect } from "react"
import { X, Phone, User, Volume2, Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface FakeCallModalProps {
  onClose: () => void
}

export function FakeCallModal({ onClose }: FakeCallModalProps) {
  const [callStage, setCallStage] = useState<"setup" | "incoming" | "active">("setup")
  const [delay, setDelay] = useState(30)
  const [callDuration, setCallDuration] = useState(60)
  const [timeLeft, setTimeLeft] = useState(0)
  const [callTime, setCallTime] = useState(0)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (callStage === "incoming") {
      setTimeLeft(delay)
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCallStage("active")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (callStage === "active") {
      setCallTime(0)
      timer = setInterval(() => {
        setCallTime((prev) => {
          if (prev >= callDuration) {
            onClose()
            return callDuration
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [callStage, delay, callDuration, onClose])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartCall = () => {
    setCallStage("incoming")
  }

  if (callStage === "setup") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Fake Call Setup</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Caller Name</label>
              <Select defaultValue="mom">
                <SelectTrigger>
                  <SelectValue placeholder="Select caller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mom">Mom</SelectItem>
                  <SelectItem value="dad">Dad</SelectItem>
                  <SelectItem value="friend">Best Friend</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Call Delay (seconds)</label>
                <span className="text-sm">{delay}s</span>
              </div>
              <Slider value={[delay]} min={5} max={60} step={5} onValueChange={(value) => setDelay(value[0])} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium">Call Duration (seconds)</label>
                <span className="text-sm">{callDuration}s</span>
              </div>
              <Slider
                value={[callDuration]}
                min={30}
                max={180}
                step={30}
                onValueChange={(value) => setCallDuration(value[0])}
              />
            </div>

            <div className="pt-2 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button className="flex-1 bg-[#8A4FFF] hover:bg-[#8A4FFF]/90" onClick={handleStartCall}>
                Start Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (callStage === "incoming") {
    return (
      <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50">
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 rounded-full bg-[#8A4FFF]/20 flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Mom</h2>
          <p className="text-white/70 mb-8">Incoming call...</p>
          <p className="text-white/50 mb-8">Call will connect in {timeLeft} seconds</p>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-16 w-16 rounded-full border-2 border-red-500 bg-transparent text-red-500 hover:bg-red-500/10"
              onClick={onClose}
            >
              <X className="h-8 w-8" />
            </Button>

            <Button
              size="icon"
              className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setCallStage("active")}
            >
              <Phone className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-between p-4 z-50">
      <div className="w-full pt-12">
        <h2 className="text-2xl font-bold text-white text-center">Mom</h2>
        <p className="text-white/70 text-center">{formatTime(callTime)}</p>
      </div>

      <div className="w-24 h-24 rounded-full bg-[#8A4FFF]/20 flex items-center justify-center">
        <User className="h-12 w-12 text-white" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-full text-white"
            onClick={() => setMuted(!muted)}
          >
            {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-white">
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>

        <Button
          size="icon"
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white mx-auto flex"
          onClick={onClose}
        >
          <X className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}

