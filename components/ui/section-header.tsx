import type React from "react"
interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      {action}
    </div>
  )
}

