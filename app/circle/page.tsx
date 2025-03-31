"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Plus, Phone, MessageCircle, MapPin, Clock, Settings } from "lucide-react"

import { PageContainer } from "@/components/layout/page-container"
import { SectionHeader } from "@/components/ui/section-header"
import { CheckInModal } from "@/components/features/check-in-modal"
import { SafetyTimerModal } from "@/components/features/safety-timer-modal"
import { ContactPermissionsModal } from "@/components/features/contact-permissions-modal"
import { CallModal } from "@/components/features/call-modal"
import { MessageModal } from "@/components/features/message-modal"
import { AddContactModal } from "@/components/features/add-contact-modal"
import { CircleSettingsModal } from "@/components/features/circle-settings-modal"

export default function CirclePage() {
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [showTimerModal, setShowTimerModal] = useState(false)
  const [showContactPermissionsModal, setShowContactPermissionsModal] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showAddContactModal, setShowAddContactModal] = useState(false)
  const [showCircleSettingsModal, setShowCircleSettingsModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  const [trustedContacts, setTrustedContacts] = useState([
    {
      id: 1,
      name: "Emma Johnson",
      relationship: "Sister",
      phone: "+1 (555) 123-4567",
      lastActive: "2 min ago",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 2,
      name: "Michael Chen",
      relationship: "Friend",
      phone: "+1 (555) 987-6543",
      lastActive: "15 min ago",
      avatar: "/placeholder.svg?height=50&width=50",
    },
    {
      id: 3,
      name: "Sophia Rodriguez",
      relationship: "Roommate",
      phone: "+1 (555) 456-7890",
      lastActive: "1 hour ago",
      avatar: "/placeholder.svg?height=50&width=50",
    },
  ])

  const handleContactClick = (contact: any) => {
    setSelectedContact(contact)
    setShowContactPermissionsModal(true)
  }

  const handleCallContact = (contact: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the contact click
    setSelectedContact(contact)
    setShowCallModal(true)
  }

  const handleMessageContact = (contact: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the contact click
    setSelectedContact(contact)
    setShowMessageModal(true)
  }

  const handleShareLocation = (contact: any, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the contact click
    // In a real app, we would implement location sharing
    console.log(`Sharing location with ${contact.name}`)
    alert(`Location shared with ${contact.name}`)
  }

  const handleAddContact = (newContact: any) => {
    const contact = {
      id: Date.now(),
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      lastActive: "Just added",
      avatar: "/placeholder.svg?height=50&width=50",
    }

    setTrustedContacts([...trustedContacts, contact])
  }

  return (
    <PageContainer title="My Circle">
      {/* Circle Status */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-teal-400 text-white shadow-lg p-5"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-8 border-white opacity-20"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-full mr-3">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Circle of {trustedContacts.length}</h3>
              <p className="text-sm text-white text-opacity-90">{trustedContacts.length} trusted contacts</p>
            </div>
            <button
              onClick={() => setShowCircleSettingsModal(true)}
              className="ml-auto p-2 rounded-full hover:bg-white hover:bg-opacity-20"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <div className="flex space-x-2 mb-4">
            {trustedContacts.slice(0, 4).map((contact) => (
              <div key={contact.id} className="relative">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center overflow-hidden">
                  <img
                    src={contact.avatar || "/placeholder.svg"}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
            ))}
            {trustedContacts.length > 4 && (
              <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <span className="text-white font-medium">+{trustedContacts.length - 4}</span>
              </div>
            )}
            <button
              onClick={() => setShowAddContactModal(true)}
              className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setShowCircleSettingsModal(true)}
            className="w-full py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors font-medium"
          >
            Manage Circle Settings
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-4 gap-3">
          <motion.button
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (trustedContacts.length > 0) {
                setSelectedContact(trustedContacts[0])
                setShowCallModal(true)
              } else {
                alert("Add a contact first to use this feature")
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-1">
              <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white text-center">Call</span>
          </motion.button>

          <motion.button
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (trustedContacts.length > 0) {
                setSelectedContact(trustedContacts[0])
                setShowMessageModal(true)
              } else {
                alert("Add a contact first to use this feature")
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center mb-1">
              <MessageCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white text-center">Message</span>
          </motion.button>

          <motion.button
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCheckInModal(true)}
          >
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-1">
              <MapPin className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white text-center">Check In</span>
          </motion.button>

          <motion.button
            className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex flex-col items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTimerModal(true)}
          >
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-1">
              <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs font-medium text-gray-800 dark:text-white text-center">Set Timer</span>
          </motion.button>
        </div>
      </div>

      {/* Trusted Contacts */}
      <div>
        <SectionHeader
          title="Trusted Contacts"
          action={
            <button
              onClick={() => setShowAddContactModal(true)}
              className="text-sm text-purple-600 dark:text-purple-400 flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Contact
            </button>
          }
        />
        <div className="space-y-3">
          {trustedContacts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No contacts yet</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Add trusted contacts to your circle for enhanced safety features.
              </p>
              <button
                onClick={() => setShowAddContactModal(true)}
                className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Contact
              </button>
            </div>
          ) : (
            trustedContacts.map((contact) => (
              <motion.div
                key={contact.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleContactClick(contact)}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden">
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-base font-medium text-gray-800 dark:text-white">{contact.name}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{contact.lastActive}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.relationship}</p>
                    <div className="flex mt-2 space-x-2">
                      <button
                        className="p-1.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                        onClick={(e) => handleCallContact(contact, e)}
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400"
                        onClick={(e) => handleMessageContact(contact, e)}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
                        onClick={(e) => handleShareLocation(contact, e)}
                      >
                        <MapPin className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCheckInModal && <CheckInModal onClose={() => setShowCheckInModal(false)} isOpen={showCheckInModal} />}
      </AnimatePresence>

      <AnimatePresence>
        {showTimerModal && <SafetyTimerModal onClose={() => setShowTimerModal(false)} isOpen={showTimerModal} />}
      </AnimatePresence>

      <AnimatePresence>
        {showContactPermissionsModal && selectedContact && (
          <ContactPermissionsModal
            onClose={() => setShowContactPermissionsModal(false)}
            isOpen={showContactPermissionsModal}
            contact={selectedContact}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCallModal && selectedContact && (
          <CallModal onClose={() => setShowCallModal(false)} isOpen={showCallModal} contact={selectedContact} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessageModal && selectedContact && (
          <MessageModal
            onClose={() => setShowMessageModal(false)}
            isOpen={showMessageModal}
            contact={selectedContact}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddContactModal && (
          <AddContactModal
            onClose={() => setShowAddContactModal(false)}
            isOpen={showAddContactModal}
            onAddContact={handleAddContact}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCircleSettingsModal && (
          <CircleSettingsModal onClose={() => setShowCircleSettingsModal(false)} isOpen={showCircleSettingsModal} />
        )}
      </AnimatePresence>
    </PageContainer>
  )
}

