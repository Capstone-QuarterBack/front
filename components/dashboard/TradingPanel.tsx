import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/date-utils"

interface CsPrice {
  csPrice: number
  updateTime: string
}

interface TradingPanelProps {
  data: {
    title: string
    amount: string
    change?: string
    isPositive?: boolean
    times?: string[]
    hideTransactionText?: boolean
    priceHistory?: CsPrice[]
    hideChangeRate?: boolean
    hideTimeList?: boolean // 날짜 정보 숨김 속성 추가
  }
  className?: string
  aspectRatio?: number
  showPriceHistory?: boolean
}

export function TradingPanel({ data, className = "", aspectRatio = 1.5, showPriceHistory = false }: TradingPanelProps) {
  const {
    title,
    amount,
    change,
    isPositive = true,
    times = [],
    hideTransactionText = false,
    priceHistory = [],
    hideChangeRate = false,
    hideTimeList = false, // 기본값은 false
  } = data

  const borderColor = isPositive ? "border-green-500" : "border-red-500"
  const textColor = isPositive ? "text-green-500" : "text-red-500"

  return (
    <div className={cn(`relative w-full`, className)} style={{ paddingBottom: `${100 / aspectRatio}%` }}>
      <div
        className="absolute inset-0 border-l-4 bg-zinc-700/30 p-4 flex flex-col"
        style={{ borderLeftColor: isPositive ? "#22c55e" : "#ef4444" }}
      >
        {/* 헤더 */}
        <div>
          <div className="text-sm text-zinc-300 mb-1">{title}</div>
          <div className={`text-xl font-bold mb-1 ${textColor}`}>
            {amount.includes("로딩 중") ? <div className="h-7 w-32 animate-pulse rounded bg-zinc-600"></div> : amount}
          </div>

          {/* 변동률 표시 (hideChangeRate가 true면 숨김) */}
          {!hideChangeRate && change && (
            <div className={`flex items-center text-xs ${textColor}`}>
              <span className="mr-1">{isPositive ? "▲" : "▼"}</span> {change.split(" ")[1]}
            </div>
          )}
        </div>

        {/* 가격 리스트 또는 시간 리스트 (hideTimeList가 true면 숨김) */}
        {!hideTimeList && (
          <div className="mt-4 flex-1 overflow-auto pr-4">
            {showPriceHistory && priceHistory.length > 0 ? (
              // 가격 리스트 (테이블 형식)
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="pb-2 text-xs font-medium text-zinc-400 w-3/5">날짜</th>
                    <th className="pb-2 text-xs font-medium text-zinc-400 w-2/5">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map((price, index) => (
                    <tr key={index} className="border-b border-zinc-800">
                      <td className="py-2 text-xs text-zinc-400">
                        {formatDate(new Date(price.updateTime), "yyyy/MM/dd HH:mm:ss")}
                      </td>
                      <td className="py-2 text-sm font-medium text-green-500">₩ {price.csPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // 시간 리스트
              <div className="space-y-2">
                {times.map((time, index) => (
                  <div key={index} className="flex justify-between items-center py-1 border-b border-zinc-700">
                    <div className="text-xs text-zinc-400">{time}</div>
                    {!hideTransactionText && <div className="text-sm">거래되기</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
