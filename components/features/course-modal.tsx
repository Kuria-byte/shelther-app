"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Play, CheckCircle, Lock, Award, ArrowRight, Clock, BookOpen } from "lucide-react"

interface CourseModalProps {
  isOpen: boolean
  onClose: () => void
  course: {
    id: number
    title: string
    description: string
    completed: string
    progress: number
    image: string
    modules: {
      id: number
      title: string
      duration: string
      completed: boolean
      locked: boolean
    }[]
  }
}

export function CourseModal({ isOpen, onClose, course }: CourseModalProps) {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)

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
                <Award className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{course.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto">
            <div className="relative h-40 bg-gray-300 dark:bg-gray-700">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">5-10 minutes per module</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Course Progress</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{course.completed}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-600 dark:bg-purple-500 h-full rounded-full"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <h4 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Course Modules</h4>
              <div className="space-y-3">
                {course.modules.map((module) => (
                  <div
                    key={module.id}
                    className={`p-3 border rounded-lg ${
                      selectedModule === module.id
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    } ${module.locked ? "opacity-50" : "cursor-pointer hover:border-purple-500"}`}
                    onClick={() => !module.locked && setSelectedModule(module.id === selectedModule ? null : module.id)}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                        ) : module.locked ? (
                          <Lock className="h-5 w-5 text-gray-400 mr-2" />
                        ) : (
                          <Play className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
                        )}
                        <span className="font-medium text-gray-800 dark:text-white">{module.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{module.duration}</span>
                    </div>

                    {selectedModule === module.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          This module covers important aspects of {module.title.toLowerCase()}. Complete it to earn
                          progress toward your certificate.
                        </p>
                        <button className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          {module.completed ? "Review Module" : "Start Module"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center"
            >
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

