"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Paperclip, Smile, Image } from "lucide-react"

interface MessageModalProps {
  isOpen: boolean
  onClose: () => void
  contact: {
    id: number
    name: string
    avatar: string
  }
}

export function MessageModal({ isOpen, onClose, contact }: MessageModalProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: "user" | "contact"; timestamp: Date }>
  >([
    {
      id: 1,
      text: "Hey, how are you doing?",
      sender: "contact",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "user" as const,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate reply after 1-2 seconds
    setTimeout(
      () => {
        const replies = [
          "I'm doing well, thanks for checking in!",
          "Thanks for the message. Stay safe!",
          "I'm here if you need anything.",
          "Let me know when you get home safely.",
        ]

        const replyMessage = {
          id: Date.now() + 1,
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: "contact" as const,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, replyMessage])
      },
      1000 + Math.random() * 1000,
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full h-full sm:h-auto sm:max-h-[80vh] sm:w-[450px] bg-white dark:bg-gray-800 sm:rounded-xl shadow-lg overflow-hidden flex flex-col"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden mr-3">
                <img
                  src={contact.avatar || "/placeholder.svg"}
                  alt={contact.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{contact.name}</h3>
                <p className="text-xs text-green-500 dark:text-green-400">Online</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "contact" && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                      <img
                        src={contact.avatar || "/placeholder.svg"}
                        alt={contact.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="max-w-[70%]">
                    <div
                      className={`p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-purple-500 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTime(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Smile className="h-5 w-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 mx-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`p-2 rounded-full ${
                  message.trim()
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

