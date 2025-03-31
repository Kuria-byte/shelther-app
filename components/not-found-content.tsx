"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFoundContent() {
  const searchParams = useSearchParams()
  const from = searchParams?.get("from") || ""

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h1>

      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for.
        {from && ` You were redirected from ${from}.`}
      </p>

      <div className="space-x-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>

        <Button variant="outline" asChild>
          <Link href="/help">Get Help</Link>
        </Button>
      </div>
    </div>
  )
}

