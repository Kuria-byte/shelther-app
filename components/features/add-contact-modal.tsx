"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Plus, Phone, User } from "lucide-react"

interface AddContactModalProps {
  isOpen: boolean
  onClose: () => void
  onAddContact: (contact: {
    name: string
    relationship: string
    phone: string
  }) => void
}

export function AddContactModal({ isOpen, onClose, onAddContact }: AddContactModalProps) {
  const [newContact, setNewContact] = useState({
    name: "",
    relationship: "",
    phone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    if (!newContact.name || !newContact.phone) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onAddContact(newContact)
      setIsSubmitting(false)

      // Reset form
      setNewContact({
        name: "",
        relationship: "",
        phone: "",
      })

      onClose()
    }, 1000)
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
                <Plus className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Trusted Contact</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter contact name"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Relationship
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="relationship"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  placeholder="E.g., Friend, Family, Roommate"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-800 dark:text-purple-200 text-sm">
              <p>Trusted contacts will be notified during emergencies and can see your location when you share it.</p>
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!newContact.name || !newContact.phone || isSubmitting}
                className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Contact
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

