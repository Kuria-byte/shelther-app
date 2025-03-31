"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Progress } from "@/components/ui/progress"
import { Bell } from "lucide-react"

export default function NotificationsStep() {
  const { currentStep, totalSteps, goToNextStep, updateProfile, profile, loading } = useOnboarding()
  const [notificationPreferences, setNotificationPreferences] = useState({
    emergency_alerts: true,
    safety_tips: true,
    journey_updates: true,
    area_alerts: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    try {
      setIsSubmitting(true)

      await updateProfile({
        notification_preferences: notificationPreferences,
      })

      goToNextStep()
    } catch (error) {
      console.error("Error updating notification preferences:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleNotification = (key: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Bell className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Notifications</CardTitle>
            <CardDescription>Choose which notifications you'd like to receive</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Notification Preferences</span>
                <span>
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Emergency Alerts</h3>
                  <p className="text-sm text-muted-foreground">Critical notifications in emergency situations</p>
                </div>
                <Switch
                  checked={notificationPreferences.emergency_alerts}
                  onCheckedChange={() => toggleNotification("emergency_alerts")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Safety Tips</h3>
                  <p className="text-sm text-muted-foreground">Occasional safety advice and recommendations</p>
                </div>
                <Switch
                  checked={notificationPreferences.safety_tips}
                  onCheckedChange={() => toggleNotification("safety_tips")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Journey Updates</h3>
                  <p className="text-sm text-muted-foreground">Updates about ongoing journey monitoring</p>
                </div>
                <Switch
                  checked={notificationPreferences.journey_updates}
                  onCheckedChange={() => toggleNotification("journey_updates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Area Alerts</h3>
                  <p className="text-sm text-muted-foreground">Alerts about safety concerns in your area</p>
                </div>
                <Switch
                  checked={notificationPreferences.area_alerts}
                  onCheckedChange={() => toggleNotification("area_alerts")}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button className="w-full" onClick={handleContinue} disabled={isSubmitting || loading}>
              {isSubmitting ? "Saving..." : "Continue"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

