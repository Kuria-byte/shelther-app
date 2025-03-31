"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export default function LocationPage() {
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not found")
      }

      console.log("[ONBOARDING] Completing onboarding for user:", user.id)

      // Update profile with location preference AND set onboarding_completed to true
      const { error } = await supabase
        .from("profiles")
        .update({
          location_sharing_enabled: locationEnabled,
          onboarding_completed: true, // CRITICAL: Explicitly set onboarding_completed to true
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      console.log("[ONBOARDING] Onboarding completed successfully, onboarding_completed set to true")

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("[ONBOARDING] Error completing onboarding:", error)
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Location Sharing</CardTitle>
          <CardDescription>Enable location sharing to help us keep you safe during your journeys.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="location-sharing" className="flex flex-col space-y-1">
              <span>Share my location</span>
              <span className="text-sm text-muted-foreground">
                Allow Shelther to access your location to enable safety features
              </span>
            </Label>
            <Switch id="location-sharing" checked={locationEnabled} onCheckedChange={setLocationEnabled} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

