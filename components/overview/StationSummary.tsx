import type { StationSummaryData } from "@/types/station"
import { formatNumber } from "@/lib/utils/number-utils"

interface StationSummaryProps {
  data: StationSummaryData
  diffData?: {
    usageDiff: number
    powerDiff: number
    revenueDiff: number
  }
}

export function StationSummary({
  data,
  diffData = { usageDiff: 3, powerDiff: 6, revenueDiff: 3 },
}: StationSummaryProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm text-zinc-400 mb-2 border-b border-zinc-700 pb-2">월별 사용 내역</h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalUsage)}</div>
          <div className="text-xs text-zinc-400">총 충전 건수</div>
          <div className={`text-xs ${diffData.usageDiff >= 0 ? "text-green-500" : "text-red-500"} mt-1`}>
            {diffData.usageDiff >= 0 ? "+" : ""}
            {diffData.usageDiff}% from yesterday
          </div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalPower)}</div>
          <div className="text-xs text-zinc-400">총 이용자수(명)</div>
          <div className={`text-xs ${diffData.powerDiff >= 0 ? "text-green-500" : "text-red-500"} mt-1`}>
            {diffData.powerDiff >= 0 ? "+" : ""}
            {diffData.powerDiff}% from yesterday
          </div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalRevenue)}</div>
          <div className="text-xs text-zinc-400">총 수익(₩)</div>
          <div className={`text-xs ${diffData.revenueDiff >= 0 ? "text-green-500" : "text-red-500"} mt-1`}>
            {diffData.revenueDiff >= 0 ? "+" : ""}
            {diffData.revenueDiff}% from yesterday
          </div>
        </div>
      </div>
    </div>
  )
}
