"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useOnboarding } from "@/contexts/onboarding-context"
import { Mail, User } from "lucide-react"
import Link from "next/link"

export function SignUpScreen() {
  const router = useRouter()
  const { nextStep } = useOnboarding()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agreeToTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn("email", {
        email: formData.email,
        redirect: false,
        callbackUrl: `/auth/verify-success`,
      })

      if (!result?.ok) {
        throw new Error(result?.error || 'Failed to send verification email')
      }

      // Navigate to verification page with email
      router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`)
    } catch (error) {
      console.error("Signup error:", error)
      setError("Failed to send verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.agreeToTerms
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
        <p className="text-gray-600 mb-8">Set up your Shelther account to get started with personal safety.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                className="pl-10"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
            />
            <Label htmlFor="terms" className="text-sm leading-tight">
              I agree to the{" "}
              <Link href="#" className="text-[#8A4FFF] hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="text-[#8A4FFF] hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90 relative"
            disabled={!isFormValid() || loading}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#8A4FFF]">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {loading ? "Sending Verification..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#8A4FFF] font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

