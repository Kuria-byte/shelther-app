"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users } from "lucide-react"

export default function SafetyCirclePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Log the relationship value for debugging purposes
      console.log("[SAFETY-CIRCLE] Relationship value (not saved to DB):", formData.emergency_contact_relationship)

      // Update profile with emergency contact - REMOVE relationship field from update object
      const { error } = await supabase
        .from("profiles")
        .update({
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          // emergency_contact_relationship removed from here
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (error) {
        console.error("Error updating emergency contact:", error)
        return
      }

      // Continue to next step
      router.push("/onboarding/location")
    } catch (error) {
      console.error("Error saving emergency contact:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Safety Circle</CardTitle>
          <CardDescription>Add a trusted contact for emergencies</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Contact Name</Label>
              <Input
                id="emergency_contact_name"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                required
                placeholder="Enter contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="tel"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                required
                placeholder="Enter contact phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_relationship">Relationship</Label>
              <Input
                id="emergency_contact_relationship"
                name="emergency_contact_relationship"
                value={formData.emergency_contact_relationship}
                onChange={handleChange}
                required
                placeholder="E.g., Family, Friend, Partner"
              />
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

