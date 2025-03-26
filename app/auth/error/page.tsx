'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'Verification':
        return 'The verification link has expired or has already been used.'
      default:
        return 'An error occurred during authentication.'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-8">
          {getErrorMessage(error || '')}
        </p>
        <Button asChild className="bg-[#8A4FFF] hover:bg-[#8A4FFF]/90">
          <Link href="/auth/signup">
            Try Again
          </Link>
        </Button>
      </div>
    </div>
  )
}
