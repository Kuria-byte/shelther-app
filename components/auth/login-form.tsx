"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { AtSign, Lock, ArrowRight, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SocialLoginButtons } from "./social-login-buttons"

export function LoginForm() {
  const router = useRouter()
  const { signIn, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      await signIn(email, password)
      // Redirect happens in the auth context based on auth state
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to sign in")
    } finally {
      setIsLoading(false)
    }
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
              {formError || (error instanceof Error ? error.message : "Authentication error")}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                Forgot password?
              </Link>
            </div>
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
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
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
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
          >
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

