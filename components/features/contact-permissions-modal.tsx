"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, MapPin, Bell, Shield, Clock, Edit2, Trash2 } from "lucide-react"

interface ContactPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: number
    name: string
    relationship: string
    phone: string
    avatar: string
  }
}

export function ContactPermissionsModal({ isOpen, onClose, contact }: ContactPermissionsModalProps) {
  const [permissions, setPermissions] = useState({
    locationSharing: true,
    emergencyAlerts: true,
    journeyTracking: true,
    checkInNotifications: true,
    timerNotifications: true,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState({
    name: contact.name,
    relationship: contact.relationship,
    phone: contact.phone,
  })

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveChanges = () => {
    // In a real app, we would save these changes to the server
    console.log("Saving contact changes:", editedContact)
    console.log("Saving permission changes:", permissions)

    // Exit edit mode
    setIsEditing(false)

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
                <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {isEditing ? "Edit Contact" : "Contact Permissions"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                    <img
                      src={contact.avatar || "/placeholder.svg"}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editedContact.name}
                    onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="relationship"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="relationship"
                    value={editedContact.relationship}
                    onChange={(e) => setEditedContact({ ...editedContact, relationship: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={editedContact.phone}
                    onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center mb-6">
                  <div className="mr-3">
                    <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">{contact.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.relationship}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-base font-medium text-gray-800 dark:text-white mb-2">Permissions</h4>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mr-2">
                        <MapPin className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">Location Sharing</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-location"
                        className="sr-only"
                        checked={permissions.locationSharing}
                        onChange={() => togglePermission("locationSharing")}
                      />
                      <label
                        htmlFor="toggle-location"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          permissions.locationSharing ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            permissions.locationSharing ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-2">
                        <Bell className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">Emergency Alerts</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-emergency"
                        className="sr-only"
                        checked={permissions.emergencyAlerts}
                        onChange={() => togglePermission("emergencyAlerts")}
                      />
                      <label
                        htmlFor="toggle-emergency"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          permissions.emergencyAlerts ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            permissions.emergencyAlerts ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-2">
                        <Shield className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">Journey Tracking</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-journey"
                        className="sr-only"
                        checked={permissions.journeyTracking}
                        onChange={() => togglePermission("journeyTracking")}
                      />
                      <label
                        htmlFor="toggle-journey"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          permissions.journeyTracking ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            permissions.journeyTracking ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-2">
                        <MapPin className="h-4 w-4 text-green-500 dark:text-green-400" />
                      </div>
                      <span className="text-gray-800 dark:text-white">Check-in Notifications</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-checkin"
                        className="sr-only"
                        checked={permissions.checkInNotifications}
                        onChange={() => togglePermission("checkInNotifications")}
                      />
                      <label
                        htmlFor="toggle-checkin"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          permissions.checkInNotifications ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            permissions.checkInNotifications ? "translate-x-6" : ""
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
                      <span className="text-gray-800 dark:text-white">Timer Notifications</span>
                    </div>
                    <div className="relative inline-block w-12 h-6 align-middle select-none">
                      <input
                        type="checkbox"
                        id="toggle-timer"
                        className="sr-only"
                        checked={permissions.timerNotifications}
                        onChange={() => togglePermission("timerNotifications")}
                      />
                      <label
                        htmlFor="toggle-timer"
                        className={`block w-full h-full rounded-full cursor-pointer transition-colors ${
                          permissions.timerNotifications ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
                            permissions.timerNotifications ? "translate-x-6" : ""
                          }`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button className="px-4 py-2 border border-red-300 dark:border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove Contact
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    Save Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

