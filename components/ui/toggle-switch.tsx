"use client"

interface ToggleSwitchProps {
  id: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}

export function ToggleSwitch({ id, checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <div className="relative inline-block w-12 h-6 align-middle select-none">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} disabled={disabled} />
      <label
        htmlFor={id}
        className={`block w-full h-full rounded-full cursor-pointer transition-colors duration-300 ${
          disabled
            ? "bg-gray-300 dark:bg-gray-700 opacity-50"
            : checked
              ? "bg-purple-500"
              : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 bg-white rounded-full w-5 h-5 shadow transform transition-transform duration-300 ${
            checked ? "translate-x-6" : ""
          }`}
        ></span>
      </label>
    </div>
  )
}

