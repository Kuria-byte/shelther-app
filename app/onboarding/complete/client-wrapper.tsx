"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent } from "@/components/ui/card"

// Dynamically import the component with SSR disabled
const DynamicCompletePage = dynamic(() => import("@/components/onboarding/complete-page"), { ssr: false })

export default function CompletePageClientWrapper() {
  return (
    <Suspense
      fallback={
        <div className="container max-w-md mx-auto py-12 px-4">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold mb-2">Loading...</h1>
            </CardContent>
          </Card>
        </div>
      }
    >
      <DynamicCompletePage />
    </Suspense>
  )
}

