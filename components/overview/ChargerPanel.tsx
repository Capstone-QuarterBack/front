import type { ChargerData, MockDataType } from "@/types/station"
import type { ChargerInfoResponse } from "@/types/api"
import { ChargerStatus } from "./ChargerStatus"
import { UsageHistory } from "./UsageHistory"
import { StationSummary } from "./StationSummary"

interface ChargerPanelProps {
  charger: ChargerData
  data: MockDataType
  apiData?: ChargerInfoResponse
  showDetails?: boolean
  showSummary?: boolean
}

export function ChargerPanel({ charger, data, apiData, showDetails = false, showSummary = false }: ChargerPanelProps) {
  // 사용가능 상태인지 확인
  const isAvailable = charger.status === "AVAILABLE"
  // 사용불가 상태인지 확인
  const isUnavailable = charger.status === "UNAVAILABLE"

  // API 데이터가 있으면 사용, 없으면 모의 데이터 사용
  const usageHistory = apiData?.usages || data.usageHistory

  // 사용 내역 데이터에서 총 충전량, 총 가격 계산
  const totalChargedEnergy = apiData?.usages.reduce((sum, usage) => sum + usage.chargedEnergy, 0) || 0
  const totalRevenue = apiData?.usages.reduce((sum, usage) => sum + usage.price, 0) || 0
  const totalVehicleCount = apiData?.totalElements || 0

  // 요약 데이터 생성
  const summaryData = {
    totalUsage: totalChargedEnergy,
    totalPower: totalVehicleCount,
    totalRevenue: totalRevenue,
  }

  // 증감률 데이터 (모의 데이터)
  const diffData = {
    usageDiff: Math.floor(Math.random() * 20) - 10, // -10 ~ 10 사이의 랜덤 값
    powerDiff: Math.floor(Math.random() * 20) - 10,
    revenueDiff: Math.floor(Math.random() * 20) - 10,
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 h-full">
      <ChargerStatus id={charger.id} status={charger.status} statusText={charger.statusText} />

      {/* 사용불가 상태인 충전기에는 현재 충전 정보 표시 */}
      {isUnavailable && (
        <div className="mt-4">
          <div className="bg-zinc-900 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-zinc-400">충전 시작 시간</div>
                <div>
                  {apiData?.usages[0]?.chargeStartTime
                    ? new Date(apiData.usages[0].chargeStartTime).toLocaleString()
                    : data.stationDetails.chargeTime}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 전력량</div>
                <div>
                  {apiData?.usages[0]?.chargedEnergy
                    ? `${apiData.usages[0].chargedEnergy}(kWh)`
                    : data.stationDetails.totalPower}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">충전 완료 시간</div>
                <div>
                  {apiData?.usages[0]?.chargeEndTime
                    ? new Date(apiData.usages[0].chargeEndTime).toLocaleString()
                    : data.stationDetails.chargeEndTime}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">지불 비용</div>
                <div>
                  {apiData?.usages[0]?.price ? `${apiData.usages[0].price}(KRW)` : data.stationDetails.maxPower}
                </div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">처리 상태 정보</div>
                <div className="text-green-500">승인완료</div>
              </div>
              <div>
                <div className="text-xs text-zinc-400">오류코드</div>
                <div>{apiData?.usages[0]?.errorCode || data.stationDetails.carId}</div>
              </div>
            </div>

            {/* 강조된 정보를 위한 별도의 네모칸 */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 mt-2">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-zinc-400">차량 번호</div>
                  <div className="font-medium text-amber-500">
                    {apiData?.usages[0]?.carNumber || data.stationDetails.transactionId}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">충전기 모델</div>
                  <div className="font-medium text-green-500">
                    {apiData?.usages[0]?.chargerModel || data.stationDetails.occupancyRate}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-zinc-400">승인 번호</div>
                  <div className="font-medium text-blue-400">
                    {apiData?.usages[0]?.approvalNumber || data.stationDetails.totalRevenue}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 사용불가 충전기에도 과거 사용 내역 표시 */}
          {apiData && apiData.usages.length > 0 && (
            <div className="mt-4">
              <UsageHistory data={usageHistory} />
            </div>
          )}
        </div>
      )}

      {/* 사용가능 상태일 때는 과거 데이터와 월별 사용 내역 표시 */}
      {isAvailable && (
        <>
          {showDetails && apiData && apiData.usages.length > 0 && <UsageHistory data={usageHistory} />}
          {showSummary && (
            <StationSummary
              data={summaryData}
              diffData={{
                usageDiff: diffData.usageDiff,
                powerDiff: diffData.powerDiff,
                revenueDiff: diffData.revenueDiff,
              }}
            />
          )}
        </>
      )}
    </div>
  )
}
