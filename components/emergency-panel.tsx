"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, Phone, Video, XCircle, Clock, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useContacts, type Contact } from "@/hooks/use-contacts"
import { formatDistanceToNow } from "date-fns"
import { toast } from "@/components/ui/use-toast"

interface EmergencyPanelProps {
  onResolve?: () => void;
}

const setBrightness = async (value: number) => {
  try {
    // Check if the API is available
    if ('brightness' in window.screen && typeof window.screen.brightness?.set === 'function') {
      await window.screen.brightness.set(value);
    }
  } catch (error) {
    console.error('Failed to set brightness:', error);
  }
};

export function EmergencyPanel({ onResolve }: EmergencyPanelProps) {
  const [startTime] = useState(new Date())
  const [isRecording, setIsRecording] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const { contacts, notifyContacts } = useContacts()
  const [mountAnimation, setMountAnimation] = useState(false)

  // Error handling state
  const [isContactingEmergency, setIsContactingEmergency] = useState(false)
  const [isAlertingCircle, setIsAlertingCircle] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)

  // Handle recording toggle with error handling
  const toggleRecording = async () => {
    try {
      setRecordingError(null)
      if (!isRecording) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        })
        setIsRecording(true)
        toast({
          title: "Recording Started",
          description: "Video and audio recording is now active",
        })
      } else {
        // Stop recording logic here
        setIsRecording(false)
      }
    } catch (error) {
      setRecordingError("Unable to start recording. Please check permissions.")
      toast({
        title: "Recording Error",
        description: "Failed to start recording. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Handle emergency services call
  const handleEmergencyCall = async () => {
    try {
      setIsContactingEmergency(true)
      // Your emergency call logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated delay
      window.location.href = "tel:911"
    } catch (error) {
      toast({
        title: "Call Failed",
        description: "Unable to connect emergency call. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsContactingEmergency(false)
    }
  }

  // Handle alerting trusted circle
  const handleAlertCircle = async () => {
    try {
      setIsAlertingCircle(true)
      await notifyContacts()
      toast({
        title: "Alerts Sent",
        description: "Your trusted contacts have been notified",
      })
    } catch (error) {
      toast({
        title: "Alert Failed",
        description: "Failed to notify some contacts. Retrying...",
        variant: "destructive",
      })
    } finally {
      setIsAlertingCircle(false)
    }
  }

  // Handle emergency cancellation
  const handleCancelEmergency = async () => {
    try {
      // Your cancellation logic here
      onResolve?.()
      toast({
        title: "Emergency Cancelled",
        description: "Your contacts have been notified you're safe",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel emergency. Please try again.",
        variant: "destructive",
      })
    }
  }

  // System adjustments with error handling
  useEffect(() => {
    const setupSystemAdjustments = async () => {
      try {
        // Set max brightness
        await setBrightness(1);
        
        // Prevent screen lock
        if ('wakeLock' in navigator) {
          await navigator.wakeLock?.request('screen');
        }
      } catch (error) {
        console.error('Failed to adjust system settings:', error);
      }
    };

    setupSystemAdjustments();

    // Cleanup
    return () => {
      setBrightness(0.5).catch(console.error); // Restore default brightness
    };
  }, [])

  // Trigger mount animation after component mounts
  useEffect(() => {
    // Flash screen red briefly to indicate emergency activation
    document.documentElement.style.backgroundColor = '#FF0000'
    setTimeout(() => {
      document.documentElement.style.backgroundColor = ''
      setMountAnimation(true)
    }, 100)

    return () => {
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: mountAnimation ? [1.05, 1] : 1,
        }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ 
          type: "spring",
          damping: 20,
          stiffness: 100,
        }}
        className="fixed inset-0 bg-black/95 z-50 flex flex-col"
      >
        {/* Emergency Timer */}
        <div className="flex items-center justify-center text-red-500">
          <Clock className="w-5 h-5 mr-2" />
          <span className="text-lg font-bold">
            Emergency Active: {formatDistanceToNow(startTime)}
          </span>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3">
          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full h-16 text-lg font-bold"
            onClick={handleAlertCircle}
            disabled={isAlertingCircle}
          >
            <Users className="w-6 h-6 mr-2" />
            {isAlertingCircle ? "Alerting..." : "Alert My Circle"}
          </Button>

          <Button 
            variant="destructive" 
            size="lg" 
            className="w-full h-16 text-lg font-bold"
            onClick={handleEmergencyCall}
            disabled={isContactingEmergency}
          >
            <Phone className="w-6 h-6 mr-2" />
            {isContactingEmergency ? "Connecting..." : "Call Emergency Services"}
          </Button>
        </div>

        {/* Recording Toggle with Error State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center">
              <Video className="w-5 h-5 mr-2" />
              <span>Record Audio/Video</span>
            </div>
            <Switch 
              checked={isRecording}
              onCheckedChange={toggleRecording}
              disabled={!!recordingError}
            />
          </div>
          {recordingError && (
            <div className="flex items-center text-red-400 text-sm">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {recordingError}
            </div>
          )}
        </div>

        {/* Contact Status */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Contact Status</h3>
          {contacts.map((contact: Contact) => (
            <div 
              key={contact.id}
              className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
            >
              <span>{contact.name}</span>
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">
                  {contact.status === "responding" && contact.eta ? `ETA: ${contact.eta}` : contact.status}
                </span>
                <motion.div
                  className={`w-3 h-3 rounded-full ${
                    contact.status === "arrived" ? "bg-green-500" :
                    contact.status === "responding" ? "bg-yellow-500" :
                    contact.status === "seen" ? "bg-blue-500" :
                    "bg-gray-500"
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowCancelConfirm(true)}
        >
          <XCircle className="w-5 h-5 mr-2" />
          Cancel Emergency
        </Button>

        {/* Cancel Confirmation */}
        {showCancelConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6"
          >
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm space-y-4">
              <h3 className="text-lg font-bold">Cancel Emergency?</h3>
              <p className="text-gray-400">Are you sure you want to cancel the emergency? This will notify all contacts that you are safe.</p>
              <div className="flex space-x-3">
                <Button 
                  variant="destructive" 
                  className="flex-1"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Active
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCancelEmergency}
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
