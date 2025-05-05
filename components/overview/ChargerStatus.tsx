import { getChargerStatusColor } from "@/utils/statusUtils"

interface ChargerStatusProps {
  id: string
  status: string
  statusText: string
}

export function ChargerStatus({ id, status, statusText }: ChargerStatusProps) {
  const statusColor = getChargerStatusColor(status)

  return (
    <div className="flex items-center mb-2">
      <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center mr-2">
        <span className="font-bold">{id}</span>
      </div>
      <div className={`w-3 h-3 rounded-full ${statusColor} mr-2`}></div>
      <span>{statusText}</span>
    </div>
  )
}
