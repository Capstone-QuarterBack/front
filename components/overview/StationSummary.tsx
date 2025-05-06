import type { StationSummaryData } from "@/types/station"
import { formatNumber } from "@/lib/utils/number-utils"

interface StationSummaryProps {
  data: StationSummaryData
}

export function StationSummary({ data }: StationSummaryProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm text-zinc-400 mb-2 border-b border-zinc-700 pb-2">월별 사용 내역</h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalChargedEnergy)}</div>
          <div className="text-xs text-zinc-400">총 충전량(kWh)</div>
          <div
            className={`text-xs ${(data.chargedEnergyDiffPercent || 0) >= 0 ? "text-green-500" : "text-red-500"} mt-1`}
          >
            {(data.chargedEnergyDiffPercent || 0) >= 0 ? "+" : ""}
            {data.chargedEnergyDiffPercent || 0}% from yesterday
          </div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalVehicleCount)}</div>
          <div className="text-xs text-zinc-400">총 이용자(명)</div>
          <div
            className={`text-xs ${(data.vehicleCountDiffPercent || 0) >= 0 ? "text-green-500" : "text-red-500"} mt-1`}
          >
            {(data.vehicleCountDiffPercent || 0) >= 0 ? "+" : ""}
            {data.vehicleCountDiffPercent || 0}% from yesterday
          </div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{formatNumber(data.totalRevenue)}</div>
          <div className="text-xs text-zinc-400">총 수익(₩)</div>
          <div className={`text-xs ${(data.revenueDiffPercent || 0) >= 0 ? "text-green-500" : "text-red-500"} mt-1`}>
            {(data.revenueDiffPercent || 0) >= 0 ? "+" : ""}
            {data.revenueDiffPercent || 0}% from yesterday
          </div>
        </div>
      </div>
    </div>
  )
}
