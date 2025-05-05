import type { UsageHistoryItem } from "@/types/station"

interface UsageHistoryProps {
  data: UsageHistoryItem[]
}

export function UsageHistory({ data }: UsageHistoryProps) {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-600">
              <th className="py-1 text-left">충전 시작 시간</th>
              <th className="py-1 text-left">충전 완료 시간</th>
              <th className="py-1 text-left">충전량</th>
              <th className="py-1 text-left">최대 가격</th>
              <th className="py-1 text-left">사용자 타입</th>
              <th className="py-1 text-left">카드 번호</th>
              <th className="py-1 text-left">차량 코드</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, index) => (
              <tr key={index} className="border-b border-zinc-600">
                <td className="py-1">{item.startTime}</td>
                <td className="py-1">{item.endTime}</td>
                <td className="py-1">{item.usageKwh}(kWh)</td>
                <td className="py-1">{item.maxPower}(KW)</td>
                <td className="py-1">{item.userType}</td>
                <td className="py-1">{item.cardNumber}</td>
                <td className="py-1">{item.carId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
