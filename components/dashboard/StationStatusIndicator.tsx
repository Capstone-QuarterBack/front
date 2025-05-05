import { Battery } from "lucide-react"

interface StationStatusIndicatorProps {
  available: number
  occupied: number
  unavailable: number
}

export function StationStatusIndicator({ available, occupied, unavailable }: StationStatusIndicatorProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Battery className="h-5 w-5 text-zinc-400" />

      {available > 0 && (
        <div className="flex items-center">
          <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {available}
          </div>
        </div>
      )}

      {occupied > 0 && (
        <div className="flex items-center">
          <div className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {occupied}
          </div>
        </div>
      )}

      {unavailable > 0 && (
        <div className="flex items-center">
          <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {unavailable}
          </div>
        </div>
      )}

      {/* 사용 불가능한 충전기 (검은색) */}
      {/* 이미지에 검은색 원이 있어서 추가했습니다 */}
      <div className="flex items-center">
        <div className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">0</div>
      </div>
    </div>
  )
}
