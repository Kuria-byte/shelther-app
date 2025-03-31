"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { VerificationStatus } from "@/components/auth/verification-status"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState<string>("")

  useEffect(() => {
    const emailParam = searchParams?.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  return (
    <AuthLayout title="Verify Your Email" description="Please check your inbox for a verification link">
      <VerificationStatus email={email} />
    </AuthLayout>
  )
}

