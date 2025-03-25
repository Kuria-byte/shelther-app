"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ChevronLeft, User, Fingerprint, Shield } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SafetySetupScreen() {
  const { nextStep, prevStep, totalSteps } = useOnboarding()
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [triggerMethod, setTriggerMethod] = useState("shake")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      nextStep()
    }, 1500)
  }

  const isFormValid = () => {
    return contactName.trim() !== "" && contactPhone.trim() !== ""
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={prevStep}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-gray-500">
          {10} of {totalSteps}
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">Safety Setup</h1>
        <p className="text-gray-600 mb-8">Let's set up your essential safety features to keep you protected.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="h-5 w-5 mr-2 text-[#8A4FFF]" />
              Emergency Contact
            </h2>
            <p className="text-sm text-gray-600">
              Add at least one trusted contact who will be notified in case of emergency.
            </p>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  placeholder="Enter name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  placeholder="Enter phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="h-5 w-5 mr-2 text-[#8A4FFF]" />
              Emergency Trigger
            </h2>
            <p className="text-sm text-gray-600">Choose your preferred method to activate emergency mode.</p>

            <RadioGroup value={triggerMethod} onValueChange={setTriggerMethod}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="shake" id="shake" />
                <Label htmlFor="shake" className="flex-1 cursor-pointer">
                  Shake phone
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="button" id="button" />
                <Label htmlFor="button" className="flex-1 cursor-pointer">
                  Power button (press 5 times)
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border">
                <RadioGroupItem value="screen" id="screen" />
                <Label htmlFor="screen" className="flex-1 cursor-pointer">
                  On-screen button
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Fingerprint className="h-5 w-5 mr-2 text-[#8A4FFF]" />
              Express Login
            </h2>
            <p className="text-sm text-gray-600">Set up quick access to Shelther in emergency situations.</p>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="h-auto py-3 border-[#8A4FFF] text-[#8A4FFF]">
                <Fingerprint className="h-5 w-5 mr-2" />
                Use Biometrics
              </Button>
              <Button type="button" variant="outline" className="h-auto py-3">
                Set up PIN
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Saving Settings..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  )
}

