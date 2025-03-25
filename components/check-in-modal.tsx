"use client"

import { useState } from "react"
import { X, Check, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CheckInModalProps {
  onClose: () => void
}

export function CheckInModal({ onClose }: CheckInModalProps) {
  const [status, setStatus] = useState("safe")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    setSent(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (sent) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#36D986]/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-[#36D986]" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Check-In Sent!</h2>
          <p className="text-gray-500 mb-4">Your trusted contacts have been notified of your status.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Check In</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">I am currently...</label>
            <RadioGroup defaultValue="safe" value={status} onValueChange={setStatus} className="space-y-2">
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border ${status === "safe" ? "border-[#36D986] bg-[#36D986]/5" : "border-gray-200"}`}
              >
                <RadioGroupItem value="safe" id="safe" />
                <Label htmlFor="safe" className="flex-1 cursor-pointer">
                  Safe and well
                </Label>
              </div>
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border ${status === "caution" ? "border-[#FF9D4D] bg-[#FF9D4D]/5" : "border-gray-200"}`}
              >
                <RadioGroupItem value="caution" id="caution" />
                <Label htmlFor="caution" className="flex-1 cursor-pointer">
                  Feeling uncomfortable
                </Label>
              </div>
              <div
                className={`flex items-center space-x-2 p-3 rounded-lg border ${status === "help" ? "border-[#FF5A5A] bg-[#FF5A5A]/5" : "border-gray-200"}`}
              >
                <RadioGroupItem value="help" id="help" />
                <Label htmlFor="help" className="flex-1 cursor-pointer">
                  Need assistance
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Send to</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select contacts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All trusted contacts</SelectItem>
                <SelectItem value="mom">Mom</SelectItem>
                <SelectItem value="sister">Sister</SelectItem>
                <SelectItem value="friend">Best Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium mb-2 block">Add a message (optional)</label>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last check-in: 2 hours ago</span>
              </div>
            </div>
            <Textarea
              placeholder="I'm at the library and will be home by 9pm..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1 bg-[#8A4FFF] hover:bg-[#8A4FFF]/90" onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send Check-In
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

