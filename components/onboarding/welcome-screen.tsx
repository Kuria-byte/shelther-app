"use client"

import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/contexts/onboarding-context"
import Link from "next/link"

export function WelcomeScreen() {
  const { nextStep } = useOnboarding()

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 text-center">
      <div className="w-full" />

      <div className="space-y-6 max-w-md">
        {/* Logo placeholder - replace with actual logo */}
        <div className="w-32 h-32 bg-gradient-to-r from-[#8A4FFF] to-[#40E0D0] rounded-full mx-auto flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-16 h-16 text-white"
          >
            <path d="M10.24 20.04a8.5 8.5 0 1 0-10-7.04" />
            <path d="M13.76 7.96a8.5 8.5 0 1 0 10 7.04" />
            <path d="M2.24 14.96a8.5 8.5 0 0 0 16.52 2.08" />
            <path d="M21.76 9.04a8.5 8.5 0 0 0-16.52-2.08" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Your Personal Safety Companion</h1>

        <p className="text-gray-600">
          Shelther helps you stay safe with real-time alerts, trusted contacts, and emergency features designed for your
          peace of mind.
        </p>

        <Button onClick={nextStep} className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
          Get Started
        </Button>

        <div className="text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-[#8A4FFF] font-medium">
            Sign In
          </Link>
        </div>
      </div>

      <div className="w-full" />
    </div>
  )
}

