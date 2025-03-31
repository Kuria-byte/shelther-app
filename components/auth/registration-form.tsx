"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { AtSign, Lock, User, Phone, ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialLoginButtons } from "./social-login-buttons"

export function RegistrationForm() {
  const router = useRouter()
  const { signUp, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Password validation
  const passwordLength = password.length >= 8
  const passwordHasNumber = /\d/.test(password)
  const passwordsMatch = password === confirmPassword

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.")
      return
    }

    if (!passwordLength || !passwordHasNumber) {
      setFormError("Password does not meet requirements.")
      return
    }

    setIsLoading(true)

    try {
      await signUp(email, password, { full_name: fullName, phone })
      // The redirect happens in auth context based on verification status
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")
    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {(formError || error) && (
          <Alert className="border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950">
            <AlertDescription>
              {formError || (error instanceof Error ? error.message : "Registration error")}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(123) 456-7890"
                value={phone}
                onChange={handlePhoneChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="text-xs space-y-1 mt-1">
              <div className="flex items-center">
                {passwordLength ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={passwordLength ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center">
                {passwordHasNumber ? (
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={passwordHasNumber ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                  Contains at least one number
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`pl-10 ${confirmPassword && !passwordsMatch ? "border-red-500 focus:ring-red-500" : ""}`}
                required
              />
            </div>
            {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading || !passwordLength || !passwordHasNumber || !passwordsMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-700 absolute w-full"></div>
          <div className="bg-white dark:bg-gray-900 px-4 relative text-sm text-gray-500 dark:text-gray-400">
            or continue with
          </div>
        </div>

        <SocialLoginButtons />

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

