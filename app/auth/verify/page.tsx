"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const [timeLeft, setTimeLeft] = useState(60)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleResend = async () => {
    if (!email) return
    setLoading(true)
    try {
      await signIn("email", {
        email,
        redirect: false,
      })
      setTimeLeft(60)
    } catch (error) {
      console.error("Failed to resend:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-gray-600">
          We sent a verification link to <span className="font-medium">{email}</span>
        </p>
        <div className="py-8">
          <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#8A4FFF] flex items-center justify-center">
            <svg className="w-8 h-8 text-[#8A4FFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
        </div>
        
        <Button
          onClick={handleResend}
          disabled={timeLeft > 0 || loading}
          className="w-full relative"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : timeLeft > 0 ? (
            `Resend in ${timeLeft}s`
          ) : (
            "Resend verification link"
          )}
        </Button>
      </div>
    </div>
  )
}
