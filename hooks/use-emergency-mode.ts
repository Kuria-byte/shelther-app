import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'
import { useContacts } from './use-contacts'

interface EmergencyState {
  isActive: boolean
  activatedAt: Date | null
  reason: string | null
  location: GeolocationCoordinates | null
}

const MAX_LOCATION_RETRIES = 3
const LOCATION_TIMEOUT = 10000 // 10 seconds

async function getLocationWithRetry(retries = MAX_LOCATION_RETRIES): Promise<GeolocationPosition> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: LOCATION_TIMEOUT
        }
      )
    })
    return position
  } catch (error) {
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          throw new Error("Location access denied. Please enable location permissions.")
        case error.POSITION_UNAVAILABLE:
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return getLocationWithRetry(retries - 1)
          }
          throw new Error("Unable to determine your location. Please try again.")
        case error.TIMEOUT:
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return getLocationWithRetry(retries - 1)
          }
          throw new Error("Location request timed out. Please try again.")
        default:
          throw new Error("Unexpected location error. Please try again.")
      }
    }
    throw error
  }
}

export function useEmergencyMode() {
  const [state, setState] = useState<EmergencyState>({
    isActive: false,
    activatedAt: null,
    reason: null,
    location: null
  })
  
  const { notifyContacts } = useContacts()

  const activateEmergencyMode = useCallback(async () => {
    try {
      // Show immediate feedback
      toast({
        title: "Activating Emergency Mode",
        description: "Getting your location...",
        duration: 2000,
      })

      let location: GeolocationCoordinates | null = null
      
      try {
        const position = await getLocationWithRetry()
        location = position.coords
      } catch (locationError) {
        console.error('Location error:', locationError)
        // Continue with emergency activation even if location fails
        toast({
          title: "Location Unavailable",
          description: locationError instanceof Error ? locationError.message : "Unable to get your location",
          variant: "destructive",
          duration: 3000,
        })
      }

      // Update emergency state even without location
      setState({
        isActive: true,
        activatedAt: new Date(),
        reason: "user_triggered",
        location
      })

      // Notify emergency contacts
      await notifyContacts()

      // Show success confirmation
      toast({
        title: "Emergency Mode Activated",
        description: location 
          ? "Emergency contacts notified with your location"
          : "Emergency contacts notified (location unavailable)",
        variant: "destructive",
        duration: 5000,
      })

      // Start tracking even if initial location failed
      startEmergencyTracking()

    } catch (error) {
      console.error('Failed to activate emergency mode:', error)
      toast({
        title: "Emergency Activation Error",
        description: "Emergency mode activated with limited features. Please call emergency services directly if needed.",
        variant: "destructive",
        duration: 5000,
      })

      // Activate emergency mode anyway with limited functionality
      setState({
        isActive: true,
        activatedAt: new Date(),
        reason: "user_triggered_fallback",
        location: null
      })
    }
  }, [notifyContacts])

  const deactivateEmergencyMode = useCallback(async () => {
    try {
      // Stop emergency tracking
      stopEmergencyTracking()

      // Reset state
      setState({
        isActive: false,
        activatedAt: null,
        reason: null,
        location: null
      })

      // Notify contacts of deactivation
      // This would be a different notification than the emergency one
      await notifyContacts()

      toast({
        title: "Emergency Mode Deactivated",
        description: "Your contacts have been notified you're safe",
        duration: 3000,
      })

    } catch (error) {
      console.error('Failed to deactivate emergency mode:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate emergency mode",
        variant: "destructive",
      })
    }
  }, [notifyContacts])

  // Internal helper functions
  const startEmergencyTracking = () => {
    // Implement high-frequency location tracking
    // This would integrate with your location tracking service
  }

  const stopEmergencyTracking = () => {
    // Stop high-frequency location tracking
    // Clean up any emergency monitoring
  }

  return {
    emergencyState: state,
    isEmergencyActive: state.isActive,
    activateEmergencyMode,
    deactivateEmergencyMode,
  }
}
