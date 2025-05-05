import type { UsageHistoryItem } from "@/types/station"
import type { ChargerUsage } from "@/types/api"
import { formatDate } from "@/lib/utils/date-utils"

interface UsageHistoryProps {
  data: UsageHistoryItem[] | ChargerUsage[]
}

export function UsageHistory({ data }: UsageHistoryProps) {
  // API 응답 데이터인지 확인
  const isApiData = data.length > 0 && "chargeStartTime" in data[0]

  return (
    <div>
      <h4 className="text-sm text-zinc-400 mb-2">사용 내역</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-600">
              <th className="py-1 text-left">충전 시작 시간</th>
              <th className="py-1 text-left">충전 완료 시간</th>
              <th className="py-1 text-left">충전량</th>
              <th className="py-1 text-left">가격</th>
              <th className="py-1 text-left">차량 번호</th>
              <th className="py-1 text-left">충전기 모델</th>
              <th className="py-1 text-left">승인 번호</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, index) => {
              if (isApiData) {
                const apiItem = item as ChargerUsage
                return (
                  <tr key={index} className="border-b border-zinc-600">
                    <td className="py-1">{formatDate(apiItem.chargeStartTime)}</td>
                    <td className="py-1">{formatDate(apiItem.chargeEndTime)}</td>
                    <td className="py-1">{apiItem.chargedEnergy}(kWh)</td>
                    <td className="py-1">{apiItem.price}(KRW)</td>
                    <td className="py-1">{apiItem.carNumber}</td>
                    <td className="py-1">{apiItem.chargerModel}</td>
                    <td className="py-1">{apiItem.approvalNumber}</td>
                  </tr>
                )
              } else {
                const mockItem = item as UsageHistoryItem
                return (
                  <tr key={index} className="border-b border-zinc-600">
                    <td className="py-1">{mockItem.startTime}</td>
                    <td className="py-1">{mockItem.endTime}</td>
                    <td className="py-1">{mockItem.usageKwh}(kWh)</td>
                    <td className="py-1">{mockItem.maxPower}(KW)</td>
                    <td className="py-1">{mockItem.userType}</td>
                    <td className="py-1">{mockItem.cardNumber}</td>
                    <td className="py-1">{mockItem.carId}</td>
                  </tr>
                )
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
