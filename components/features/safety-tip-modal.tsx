"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowLeft, ArrowRight, Share2, Bookmark } from "lucide-react"

interface SafetyTipModalProps {
  isOpen: boolean
  onClose: () => void
  tip: {
    id: number
    title: string
    description: string
    category: string
    duration: string
    icon: any
    content?: string
    steps?: { title: string; description: string }[]
    resources?: { title: string; url: string }[]
  }
}

export function SafetyTipModal({ isOpen, onClose, tip }: SafetyTipModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

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
                <tip.icon className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{tip.title}</h3>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 mr-1"
              >
                <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-purple-500 text-purple-500" : ""}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center mb-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-medium">
                  {tip.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{tip.duration}</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>

              {tip.content && (
                <div className="mt-4 text-gray-700 dark:text-gray-300">
                  <p className="whitespace-pre-line">{tip.content}</p>
                </div>
              )}

              {tip.steps && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Key Steps</h4>
                  <div className="space-y-3">
                    {tip.steps.map((step, index) => (
                      <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-1">{step.title}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tip.resources && (
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Additional Resources</h4>
                  <div className="space-y-2">
                    {tip.resources.map((resource, index) => (
                      <a
                        key={index}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      >
                        <div className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-purple-500 dark:text-purple-400 mr-2" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{resource.title}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4">
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <button className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 flex items-center hover:bg-purple-200 dark:hover:bg-purple-900/50">
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

