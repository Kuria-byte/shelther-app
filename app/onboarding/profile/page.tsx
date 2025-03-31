"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, UserCircle } from "lucide-react"

export default function ProfileSetupPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get the user session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          // No session, redirect to login
          router.push("/login")
          return
        }

        // Fetch profile data
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            phone_number: profile.phone_number || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase, router])

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

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id)

      if (error) {
        console.error("Error updating profile:", error)
        return
      }

      // Continue to next step
      router.push("/onboarding/safety-circle")
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <UserCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Let us know who you are</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
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

