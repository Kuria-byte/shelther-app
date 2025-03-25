"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      try {
        // Save authentication status
        localStorage.setItem("isAuthenticated", "true")
        setLoading(false)
        router.push("/")
      } catch (error) {
        console.error("Error during login:", error)
        setLoading(false)
      }
    }, 1500)
  }

  const isFormValid = () => {
    return email.trim() !== "" && password.trim() !== ""
  }

  return (
    <div className="flex flex-col min-h-screen p-6 bg-white dark:bg-gray-900">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/onboarding")}
          className="text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome Back</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Sign in to your Shelther account to access your safety features.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-gray-200">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password" className="dark:text-gray-200">
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm text-[#8A4FFF] dark:text-[#a67fff]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 dark:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm dark:text-gray-300">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full py-6 text-lg bg-[#8A4FFF] hover:bg-[#8A4FFF]/90"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link href="/onboarding" className="text-[#8A4FFF] dark:text-[#a67fff] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

