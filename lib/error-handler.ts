/**
 * Handle authentication errors consistently
 * @param error The error to handle
 * @returns A standardized error object
 */
export const handleAuthError = (error: any): Error => {
  // Log the error for debugging
  console.error("Auth error:", error)

  // If the error is already an Error object, return it
  if (error instanceof Error) {
    return error
  }

  // If the error is a string, create an Error object
  if (typeof error === "string") {
    return new Error(error)
  }

  // If the error is an object with a message property, create an Error object
  if (error && typeof error === "object" && "message" in error) {
    return new Error(error.message as string)
  }

  // Default case: create a generic error
  return new Error("An unexpected error occurred")
}

/**
 * Get a user-friendly error message for common auth errors
 * @param error The error to get a message for
 * @returns A user-friendly error message
 */
export const getUserFriendlyAuthErrorMessage = (error: any): string => {
  if (!error) {
    return "An unknown error occurred"
  }

  const errorMessage = error instanceof Error ? error.message : String(error)

  // Check for common auth error messages
  if (errorMessage.includes("Invalid login credentials")) {
    return "Invalid email or password. Please try again."
  }

  if (errorMessage.includes("Email not confirmed")) {
    return "Your email has not been verified. Please check your inbox for a verification link."
  }

  if (errorMessage.includes("User already registered")) {
    return "An account with this email already exists. Please sign in instead."
  }

  if (errorMessage.includes("Password should be at least")) {
    return "Your password is too short. Please use at least 6 characters."
  }

  if (errorMessage.includes("rate limit")) {
    return "Too many attempts. Please try again later."
  }

  // Default message
  return "An error occurred. Please try again."
}

