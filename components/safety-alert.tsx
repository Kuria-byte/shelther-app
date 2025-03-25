import { AlertTriangle, AlertOctagon } from "lucide-react"

interface SafetyAlertProps {
  type: "caution" | "danger"
  title: string
  description: string
  distance: string
}

export function SafetyAlert({ type, title, description, distance }: SafetyAlertProps) {
  const getAlertConfig = (type: "caution" | "danger") => {
    switch (type) {
      case "caution":
        return {
          icon: AlertTriangle,
          color: "bg-[#FF9D4D]",
          textColor: "text-[#FF9D4D]",
          bgColor: "bg-[#FF9D4D]/10",
        }
      case "danger":
        return {
          icon: AlertOctagon,
          color: "bg-[#FF5A5A]",
          textColor: "text-[#FF5A5A]",
          bgColor: "bg-[#FF5A5A]/10",
        }
    }
  }

  const config = getAlertConfig(type)

  return (
    <div className={`${config.bgColor} rounded-lg p-3 flex items-start`}>
      <div className={`${config.color} w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0`}>
        <config.icon className="text-white w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className={`font-medium ${config.textColor}`}>{title}</h3>
        <p className="text-sm">{description}</p>
        <p className="text-xs mt-1 opacity-70">{distance}</p>
      </div>
    </div>
  )
}

