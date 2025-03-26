"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function VerificationSuccessPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/onboarding")
    } else if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, session, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Setting up your account...</h1>
        <div className="w-6 h-6 border-2 border-[#8A4FFF] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
