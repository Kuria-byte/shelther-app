"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useOnboarding } from "@/contexts/onboarding-context"
import { ChevronLeft, Mail, Lock, User } from "lucide-react"
import Link from "next/link"

export function SignUpScreen() {
  const { nextStep, prevStep, totalSteps } = useOnboarding()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

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
    return (
      formData.name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.password.length >= 6 &&
      formData.agreeToTerms
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex justify-between items-center mb-8">
        <Button variant="ghost" size="icon" onClick={prevStep}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="text-sm text-gray-500">
          {9} of {totalSteps}
        </div>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                className="pl-10"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

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
            className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
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

