"use client"

import { Battery } from "lucide-react"

interface StationStatusIndicatorProps {
  available: number
  occupied: number
  unavailable: number
  onClick?: () => void
}

export function StationStatusIndicator({ available, occupied, unavailable, onClick }: StationStatusIndicatorProps) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(e) => {
        // 이벤트 버블링 방지 (부모 요소의 클릭 이벤트가 발생하지 않도록)
        if (onClick) {
          e.stopPropagation()
          onClick()
        }
      }}
    >
      <Battery className="h-5 w-5 text-zinc-400" />

      {/* 사용 가능한 충전기 (초록색) - 항상 표시 */}
      <div className="flex items-center">
        <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {available}
        </div>
      </div>

      {/* 사용 중인 충전기 (주황색) - 항상 표시 */}
      <div className="flex items-center">
        <div className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {occupied}
        </div>
      </div>

      {/* 사용 불가능한 충전기 (빨간색) - 항상 표시 */}
      <div className="flex items-center">
        <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {unavailable}
        </div>
      </div>

      {/* 기타 상태의 충전기 (검은색) - 항상 표시 */}
      <div className="flex items-center">
        <div className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">0</div>
      </div>
    </div>
  )
}
