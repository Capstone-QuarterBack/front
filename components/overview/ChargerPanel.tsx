"use client"

import { useState, useEffect } from "react"
import { ChargerStatus } from "./ChargerStatus"
import { RealtimeEnergyChart } from "../charts/RealtimeEnergyChart"
import { formatNumber } from "@/lib/utils/number-utils"
import type { ChargerInfoResponse } from "@/types/api"

interface ChargerPanelProps {
  charger: {
    id: string
    status: string
    statusText: string
  }
  stationId?: string
  data: any
  apiData?: ChargerInfoResponse | null
  showDetails?: boolean
  showSummary?: boolean
}

export function ChargerPanel({
  charger,
  stationId = "station-001",
  data,
  apiData,
  showDetails = false,
  showSummary = false,
}: ChargerPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isCharging, setIsCharging] = useState(charger.status === "OCCUPIED")
  const [chargerId, setChargerId] = useState(Number.parseInt(charger.id))

  // 충전 상태가 변경되면 isCharging 상태 업데이트
  useEffect(() => {
    setIsCharging(charger.status === "OCCUPIED")
  }, [charger.status])

  // 충전기 ID가 변경되면 상태 업데이트
  useEffect(() => {
    setChargerId(Number.parseInt(charger.id))
  }, [charger.id])

  // 충전기 상태에 따른 스타일 설정
  const getBorderColor = () => {
    switch (charger.status) {
      case "AVAILABLE":
        return "border-green-500"
      case "OCCUPIED":
        return "border-blue-500"
      case "UNAVAILABLE":
        return "border-red-500"
      default:
        return "border-gray-500"
    }
  }

  return (
    <div className={`bg-zinc-800 rounded-lg overflow-hidden border ${getBorderColor()}`}>
      {/* 충전기 헤더 */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <ChargerStatus id={charger.id} status={charger.status} statusText={charger.statusText} />
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-white">충전기 {charger.id}</h3>
            <p className="text-sm text-gray-400">{charger.statusText}</p>
          </div>
        </div>
        {showDetails && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* 충전기 상태가 "OCCUPIED"(이용중)인 경우 실시간 그래프 표시 */}
      {isCharging && (
        <div className="px-4 pb-4">
          <RealtimeEnergyChart chargerId={chargerId} stationId={stationId} isCharging={isCharging} initialPower={15} />
        </div>
      )}

      {/* 충전기 상세 정보 (확장 시) */}
      {isExpanded && (
        <div className="p-4 border-t border-zinc-700">
          {/* API 데이터가 있는 경우 */}
          {apiData ? (
            <div className="space-y-4">
              {/* 요약 정보 */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-400">총 충전량</p>
                  <p className="text-lg font-semibold text-white">{formatNumber(apiData.totalChargedEnergy, 1)} kWh</p>
                  <p className="text-xs text-green-500">
                    {apiData.chargedEnergyDiffPercent >= 0 ? "+" : ""}
                    {apiData.chargedEnergyDiffPercent}% from yesterday
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">총 이용자 수</p>
                  <p className="text-lg font-semibold text-white">{apiData.totalVehicleCount}명</p>
                  <p className="text-xs text-green-500">
                    {apiData.vehicleCountDiffPercent >= 0 ? "+" : ""}
                    {apiData.vehicleCountDiffPercent}% from yesterday
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">총 수익</p>
                  <p className="text-lg font-semibold text-white">{formatNumber(apiData.totalRevenue, 0)}원</p>
                  <p className="text-xs text-green-500">
                    {apiData.revenueDiffPercent >= 0 ? "+" : ""}
                    {apiData.revenueDiffPercent}% from yesterday
                  </p>
                </div>
              </div>

              {/* 최근 사용 내역 */}
              {apiData.usages && apiData.usages.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">최근 사용 내역</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                      <thead className="text-xs text-gray-400 uppercase bg-zinc-700">
                        <tr>
                          <th className="px-4 py-2">시작 시간</th>
                          <th className="px-4 py-2">종료 시간</th>
                          <th className="px-4 py-2">충전량</th>
                          <th className="px-4 py-2">금액</th>
                          <th className="px-4 py-2">차량번호</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apiData.usages.map((usage, index) => (
                          <tr key={index} className="border-b border-zinc-700">
                            <td className="px-4 py-2">{new Date(usage.chargeStartTime).toLocaleString()}</td>
                            <td className="px-4 py-2">
                              {usage.chargeEndTime ? new Date(usage.chargeEndTime).toLocaleString() : "-"}
                            </td>
                            <td className="px-4 py-2">{usage.chargedEnergy.toFixed(2)} kWh</td>
                            <td className="px-4 py-2">{usage.price.toLocaleString()} 원</td>
                            <td className="px-4 py-2">{usage.carNumber || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">사용 내역이 없습니다</div>
              )}
            </div>
          ) : (
            // API 데이터가 없는 경우
            <div className="text-center py-4 text-gray-500">데이터를 불러오는 중입니다...</div>
          )}
        </div>
      )}

      {/* 월별 사용 내역 요약 (사용 가능 상태일 때는 표시하지 않음) */}
      {showSummary && charger.status !== "AVAILABLE" && (
        <div className="p-4 border-t border-zinc-700">
          <h4 className="text-sm font-medium text-white mb-2">월별 사용 내역</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400">총 충전량</p>
              <p className="text-lg font-semibold text-white">0 kWh</p>
              <p className="text-xs text-green-500">+0% from yesterday</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">총 이용자 수</p>
              <p className="text-lg font-semibold text-white">0명</p>
              <p className="text-xs text-green-500">+0% from yesterday</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">총 수익</p>
              <p className="text-lg font-semibold text-white">0원</p>
              <p className="text-xs text-green-500">+0% from yesterday</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
