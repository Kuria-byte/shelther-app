"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Shield } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const router = useRouter()
  const { status } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && status === "authenticated") {
      router.push("/")
    }
  }, [status, router, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-purple-600 to-teal-400 rounded-full p-2">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-400 text-transparent bg-clip-text">
              Shelther
            </div>
          </Link>

          <AnimatePresence mode="wait">
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            By signing in or creating an account, you agree to our{" "}
            <Link href="/terms" className="text-purple-600 hover:text-purple-800 dark:text-purple-400">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-purple-600 hover:text-purple-800 dark:text-purple-400">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

