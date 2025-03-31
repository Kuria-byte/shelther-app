/**
 * Gets the base URL of the application based on environment
 * Works in both client and server contexts
 */
export function getAppUrl(): string {
  // For production deployment on Vercel
  if (process.env.VERCEL_URL) {
    // Use the exact production URL for Supabase auth
    return "https://v0-shelher-zeta.vercel.app"
  }

  // For server-side rendering or API routes in non-production
  if (typeof window === "undefined") {
    // Use environment variable if available
    if (process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL
    }

    // Fallback for development
    return "http://localhost:3000"
  }

  // For client-side rendering, use the current window location
  return window.location.origin
}

