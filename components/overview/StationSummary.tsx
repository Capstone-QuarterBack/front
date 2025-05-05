import type { StationSummaryData } from "@/types/station"

interface StationSummaryProps {
  data: StationSummaryData
}

export function StationSummary({ data }: StationSummaryProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm text-zinc-400 mb-2 border-b border-zinc-700 pb-2">월별 사용 내역</h4>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{data.totalUsage}</div>
          <div className="text-xs text-zinc-400">총 충전 건수(MWh)</div>
          <div className="text-xs text-green-500 mt-1">+3% from yesterday</div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{data.totalPower}</div>
          <div className="text-xs text-zinc-400">총 이용자수(명)</div>
          <div className="text-xs text-green-500 mt-1">+6% from yesterday</div>
        </div>
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold">{data.totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-zinc-400">총 수익(₩)</div>
          <div className="text-xs text-green-500 mt-1">+3% from yesterday</div>
        </div>
      </div>
    </div>
  )
}
