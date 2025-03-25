"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface EmergencyResolutionProps {
  onComplete: () => void
}

export function EmergencyResolution({ onComplete }: EmergencyResolutionProps) {
  const [reason, setReason] = useState("")

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#8A4FFF] to-[#40E0D0] flex flex-col p-6 z-50">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">You're Safe</h1>
        <p className="text-white/80 mt-2">We're glad you're okay. Please let us know what happened.</p>
      </div>

      <div className="bg-white rounded-2xl p-5 mb-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">What happened?</h2>

        <RadioGroup defaultValue="false_alarm" className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="false_alarm" id="false_alarm" />
            <Label htmlFor="false_alarm" className="text-gray-700">
              False alarm
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="felt_unsafe" id="felt_unsafe" />
            <Label htmlFor="felt_unsafe" className="text-gray-700">
              I felt unsafe
            </Label>
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <RadioGroupItem value="emergency_resolved" id="emergency_resolved" />
            <Label htmlFor="emergency_resolved" className="text-gray-700">
              Emergency resolved
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other" className="text-gray-700">
              Other
            </Label>
          </div>
        </RadioGroup>

        <Textarea
          placeholder="Add more details (optional)"
          className="w-full border-gray-300"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl p-5 mb-auto shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Notify your Circle of 3</h2>
        <p className="text-gray-600 mb-4">Let your emergency contacts know you're safe now.</p>
        <Button className="w-full bg-[#36D986] hover:bg-[#36D986]/90 text-white">Send "I'm Safe" Message</Button>
      </div>

      <Button
        onClick={onComplete}
        className="bg-white text-[#8A4FFF] hover:bg-white/90 font-semibold text-lg py-6 rounded-full mt-4"
      >
        Return to Home
      </Button>
    </div>
  )
}

