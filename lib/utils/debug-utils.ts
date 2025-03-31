// If this file doesn't exist or you want to keep the existing one, you can skip this update

export const DEBUG_CONFIG = {
  // Enable to show debug UI elements
  showDebugUI: process.env.NODE_ENV === "development",
  // Delay before redirecting (ms)
  redirectDelay: 1000,
  // Use window.location.href instead of router.push()
  useForceRedirect: false,
  // Log level (0=none, 1=errors, 2=warnings, 3=info, 4=debug)
  logLevel: 4,
}

/**
 * Logs a message with a timestamp and optional data
 *
 * @param source - The source of the log (component or function name)
 * @param message - The message to log
 * @param data - Optional data to include in the log
 */
export function logWithTimestamp(source: string, message: string, data?: any) {
  const timestamp = new Date().toISOString()

  if (data) {
    console.log(`[${timestamp}] [${source}] ${message}`, data)
  } else {
    console.log(`[${timestamp}] [${source}] ${message}`)
  }
}

/**
 * Log an error with a timestamp
 */
export function logErrorWithTimestamp(category: string, message: string, error?: any) {
  if (DEBUG_CONFIG.logLevel < 1) return

  const timestamp = new Date().toISOString()
  console.error(`[${timestamp}] [${category}] ${message}`, error || "")
}

/**
 * Add tracking parameters to a URL
 */
export function addRedirectTracking(url: string, source: string): string {
  if (!url) return url

  const separator = url.includes("?") ? "&" : "?"
  return `${url}${separator}source=${source}&t=${Date.now()}`
}

/**
 * Check if a URL contains an auth token
 */
export function hasAuthToken(url: string): boolean {
  const tokenParams = ["access_token", "refresh_token", "token", "code"]

  for (const param of tokenParams) {
    if (url.includes(`${param}=`)) {
      return true
    }
  }

  return false
}

