import { type NextRequest, NextResponse } from "next/server"

/**
 * Debug API route for testing server-side redirects
 * Usage: /api/debug-redirect?target=/onboarding
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const target = searchParams.get("target") || "/"
  const delay = Number.parseInt(searchParams.get("delay") || "0", 10)

  console.log(`[DEBUG-REDIRECT] Redirecting to ${target}${delay ? ` with ${delay}ms delay` : ""}`)

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  return NextResponse.redirect(new URL(target, request.url))
}

