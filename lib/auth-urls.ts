import { getAppUrl } from "@/lib/get-app-url"

/**
 * Centralized configuration for all authentication-related URLs
 * This ensures consistency across the application
 */
export const authUrls = {
  /**
   * Get the verification confirmation URL (used after email verification)
   * @param token Optional token to include in the URL
   * @returns The full URL to the verification confirmation page
   */
  getVerificationConfirmationUrl: (token?: string): string => {
    const baseUrl = getAppUrl()
    const url = `${baseUrl}/verify-confirmation`
    return token ? `${url}?token=${encodeURIComponent(token)}` : url
  },

  /**
   * Get the auth callback URL (used for OAuth and general auth redirects)
   * @returns The full URL to the auth callback page
   */
  getAuthCallbackUrl: (): string => {
    const baseUrl = getAppUrl()
    return `${baseUrl}/auth/callback`
  },

  /**
   * Get the login URL
   * @param redirect Optional URL to redirect to after login
   * @returns The full URL to the login page
   */
  getLoginUrl: (redirect?: string): string => {
    const baseUrl = getAppUrl()
    const url = `${baseUrl}/login`
    return redirect ? `${url}?redirect=${encodeURIComponent(redirect)}` : url
  },

  /**
   * Get the onboarding URL
   * @returns The full URL to the onboarding page
   */
  getOnboardingUrl: (): string => {
    const baseUrl = getAppUrl()
    return `${baseUrl}/onboarding`
  },

  /**
   * Get the home URL
   * @returns The full URL to the home page
   */
  getHomeUrl: (): string => {
    const baseUrl = getAppUrl()
    return `${baseUrl}/`
  },

  /**
   * Get the verify email URL
   * @param email Optional email to pre-fill
   * @returns The full URL to the verify email page
   */
  getVerifyUrl: (email?: string): string => {
    const baseUrl = getAppUrl()
    const url = `${baseUrl}/verify`
    return email ? `${url}?email=${encodeURIComponent(email)}` : url
  },
}

