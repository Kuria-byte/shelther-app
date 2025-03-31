"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Settings, Bell, Shield, Clock, AlertTriangle, Lock } from "lucide-react"

interface CircleSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CircleSettingsModal({ isOpen, onClose }: CircleSettingsModalProps) {
  const [settings, setSettings] = useState({
    autoNotifyEmergency: true,
    shareLocationWithAll: false,
    notifyOnCheckIn: true,
    notifyOnTimerExpiry: true,
    notifyOnJourneyComplete: true,
    emergencyAccessCode: "1234",
    maxEmergencyContacts: 5,
  })

  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "privacy" | "emergency">("general")

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === "boolean") {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }))
    }
  }

  const handleSaveChanges = () => {
    // In a real app, we would save these changes to the server
    console.log("Saving circle settings:", settings)

    // Close modal after a brief delay
    setTimeout(() => {
      onClose()
    }, 500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 sm:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-lg overflow-hidden"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                <Settings className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Circle Settings</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "general"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "notifications"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("privacy")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "privacy"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Privacy
              </button>
              <button
                onClick={() => setActiveTab("emergency")}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "emergency"
                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Emergency
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {activeTab === "general" && (
              <>
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">Circle Management</h4>

                  <div>
                    <label
                      htmlFor="max-contacts"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Maximum Emergency Contacts
                    </label>
                    <select
                      id="max-contacts"
                      value={settings.maxEmergencyContacts}
                      onChange={(e) =>
                        setSettings({ ...settings, maxEmergencyContacts: Number.parseInt(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="3">3 contacts</option>
                      <option value="5">5 contacts</option>
                      <option value="7">7 contacts</option>
                      <option value="10">10 contacts</option>
                    </select>
                  </div>

                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-800 dark:text-purple-200 text-sm">
                    <p>
                      Your circle consists of trusted contacts who will be notified during emergencies and can see your
                      location when you share it.
                    </p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <>
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">Notification Settings</h4>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                        <Bell className="h-4 w-4 text-green-500 dark:text-green-400" />
                      </div>
                      <div>
                        <span className="text-gray-800 dark:text-white">Check-in Notifications</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Notify contacts when you check in</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-checkin-notify"
                        className="sr-only"
                        checked={settings.notifyOnCheckIn}
                        onChange={() => toggleSetting("notifyOnCheckIn")}
                      />
                      <label
                        htmlFor="toggle-checkin-notify"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          settings.notifyOnCheckIn ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            settings.notifyOnCheckIn ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-2">
                        <Clock className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                      </div>
                      <div>
                        <span className="text-gray-800 dark:text-white">Timer Notifications</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Notify contacts when timer expires</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-timer-notify"
                        className="sr-only"
                        checked={settings.notifyOnTimerExpiry}
                        onChange={() => toggleSetting("notifyOnTimerExpiry")}
                      />
                      <label
                        htmlFor="toggle-timer-notify"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          settings.notifyOnTimerExpiry ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            settings.notifyOnTimerExpiry ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <span className="text-gray-800 dark:text-white">Journey Notifications</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Notify when journey is complete</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-journey-notify"
                        className="sr-only"
                        checked={settings.notifyOnJourneyComplete}
                        onChange={() => toggleSetting("notifyOnJourneyComplete")}
                      />
                      <label
                        htmlFor="toggle-journey-notify"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          settings.notifyOnJourneyComplete ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            settings.notifyOnJourneyComplete ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "privacy" && (
              <>
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">Privacy Settings</h4>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
                        <Lock className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <span className="text-gray-800 dark:text-white">Share Location with All</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Share location with all contacts</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-share-location"
                        className="sr-only"
                        checked={settings.shareLocationWithAll}
                        onChange={() => toggleSetting("shareLocationWithAll")}
                      />
                      <label
                        htmlFor="toggle-share-location"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          settings.shareLocationWithAll ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            settings.shareLocationWithAll ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-800 dark:text-purple-200 text-sm">
                    <p>When disabled, you'll need to manually share your location with individual contacts.</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === "emergency" && (
              <>
                <div className="space-y-4">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white">Emergency Settings</h4>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <span className="text-gray-800 dark:text-white">Auto-Notify in Emergency</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Automatically notify all contacts</p>
                      </div>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-auto-notify"
                        className="sr-only"
                        checked={settings.autoNotifyEmergency}
                        onChange={() => toggleSetting("autoNotifyEmergency")}
                      />
                      <label
                        htmlFor="toggle-auto-notify"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          settings.autoNotifyEmergency ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            settings.autoNotifyEmergency ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="emergency-code"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Emergency Access Code
                    </label>
                    <input
                      type="text"
                      id="emergency-code"
                      value={settings.emergencyAccessCode}
                      onChange={(e) => setSettings({ ...settings, emergencyAccessCode: e.target.value })}
                      placeholder="Enter 4-digit code"
                      maxLength={4}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This code can be used by emergency services to access your information.
                    </p>
                  </div>

                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-800 dark:text-red-200 text-sm">
                    <p>
                      In emergency mode, your location and personal details will be shared with all trusted contacts.
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <button
                onClick={handleSaveChanges}
                className="w-full py-3 rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

