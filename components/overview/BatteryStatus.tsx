import type { MockDataType } from "@/types/station"

interface BatteryStatusProps {
  data: MockDataType
}

export function BatteryStatus({ data }: BatteryStatusProps) {
  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 border-b border-zinc-700 pb-2">ESS 배터리 상태</h3>

      <div className="mb-6 flex justify-center">
        <div className="relative w-48 h-20 border-2 border-white rounded-r-full rounded-l-full flex items-center justify-center">
          <div
            className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-l-full"
            style={{ width: `${data.batteryPercentage}%` }}
          ></div>
          <span className="relative z-10 text-xl font-bold">{data.batteryPercentage}%</span>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-white rounded-r-sm"></div>
        </div>
      </div>

      <h3 className="text-md font-bold mb-2 border-b border-zinc-700 pb-2">충전 정보</h3>
      <div className="grid grid-cols-3 text-center text-xs border-b border-zinc-700 py-1">
        <div>충전일 시간</div>
        <div>충전량</div>
        <div>거래금액</div>
      </div>
      {data.chargingHistory.map((item, index) => (
        <div key={index} className="grid grid-cols-3 text-center text-xs border-b border-zinc-700 py-1">
          <div>
            {item.date} {item.time}
          </div>
          <div>{item.power}</div>
          <div>{item.price}</div>
        </div>
      ))}

      <h3 className="text-md font-bold mt-4 mb-2 border-b border-zinc-700 pb-2">충전 요금</h3>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm">현재 가격</div>
        <div className="text-green-500 font-bold">₩ {data.priceHistory[0].price}</div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm">변동</div>
        <div className="text-green-500">▲ {data.priceHistory[0].change}</div>
      </div>

      <div className="mt-4">
        {data.priceHistory.map((item, index) => (
          <div key={index} className="grid grid-cols-3 text-xs border-b border-zinc-700 py-2">
            <div>
              {item.date} {item.time}
            </div>
            <div className="text-right">{item.price}</div>
            <div className={`text-right ${Number(item.change) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {Number(item.change) >= 0 ? "+" : ""}
              {item.change}
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-md font-bold mt-4 mb-2 border-b border-zinc-700 pb-2">충전 시간대 정보</h3>
      <div className="h-32 bg-zinc-700 rounded-lg p-2">
        <div className="w-full h-full relative">
          {/* 그래프 배경 */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-b border-dashed border-zinc-600"></div>
            <div className="border-b border-dashed border-zinc-600"></div>
            <div className="border-b border-dashed border-zinc-600"></div>
          </div>

          {/* X축 레이블 */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-zinc-400">
            <span>01</span>
            <span>03</span>
            <span>05</span>
            <span>07</span>
            <span>09</span>
            <span>11</span>
            <span>13</span>
            <span>15</span>
            <span>17</span>
            <span>19</span>
            <span>21</span>
            <span>23</span>
          </div>

          {/* 그래프 라인 (모의 데이터) */}
          <div className="absolute inset-0 flex items-end">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0,90 L8,85 L16,88 L24,80 L32,70 L40,40 L48,60 L56,70 L64,75 L72,60 L80,40 L88,50 L100,80"
                fill="none"
                stroke="#EC4899"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
