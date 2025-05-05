import type { ChargerData, MockDataType } from "@/types/station"
import { ChargerStatus } from "./ChargerStatus"
import { UsageHistory } from "./UsageHistory"
import { StationSummary } from "./StationSummary"

interface ChargerPanelProps {
  charger: ChargerData
  data: MockDataType
  showDetails?: boolean
  showSummary?: boolean
}

export function ChargerPanel({ charger, data, showDetails = false, showSummary = false }: ChargerPanelProps) {
  // 사용가능 상태인지 확인
  const isActive = charger.status === "ACTIVE"
  // 사용중 상태인지 확인
  const isInUse = charger.status === "INACTIVE"

  return (
    <div className="bg-zinc-800 rounded-lg p-4 h-full">
      <ChargerStatus id={charger.id} status={charger.status} statusText={charger.statusText} />

      {/* 사용중인 충전기에는 현재 충전 정보 표시 */}
      {isInUse && (
        <div className="mt-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-zinc-400">충전 시작 시간</div>
                <div>{data.stationDetails.chargeTime}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 전력량</div>
                <div>{data.stationDetails.totalPower}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 완료 예상 시간</div>
                <div>{data.stationDetails.chargeEndTime}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">예상 지불 비용</div>
                <div>{data.stationDetails.maxPower}</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">처리 상태 정보</div>
                <div className="text-green-500">승인완료</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">오류코드</div>
                <div>{data.stationDetails.carId}</div>
              </div>
            </div>

            {/* 강조된 정보를 위한 별도의 네모칸 */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mt-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-zinc-400">카드 정보</div>
                  <div className="font-medium text-amber-500">{data.stationDetails.transactionId}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">현재 충전 상태</div>
                  <div className="font-medium text-green-500">{data.stationDetails.occupancyRate}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">전체 충전 요금액</div>
                  <div className="font-medium text-blue-400">{data.stationDetails.totalRevenue}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 사용중인 충전기에도 과거 사용 내역 표시 */}
          <div className="mt-4">
            <h4 className="text-sm text-zinc-400 mb-2">사용 내역</h4>
            <UsageHistory data={data.usageHistory} />
          </div>
        </div>
      )}

      {/* 사용가능 상태일 때는 과거 데이터와 월별 사용 내역 표시 */}
      {isActive && (
        <>
          {showDetails && <UsageHistory data={data.usageHistory} />}
          {showSummary && (
            <StationSummary
              data={{
                totalUsage: data.totalUsage,
                totalPower: data.totalPower,
                totalRevenue: data.totalRevenue,
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
