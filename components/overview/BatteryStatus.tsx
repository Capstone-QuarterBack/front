"use client"

import { useState, useEffect } from "react"
import type { MockDataType } from "@/types/station"
import type { CongestionData, ChargingHistoryResponse } from "@/types/api"
import { fetchCongestionData, fetchChargingHistory } from "@/services/chargerApi"
import { formatDate } from "@/lib/utils/date-utils"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"

interface BatteryStatusProps {
  data?: MockDataType
  stationId: string
}

export function BatteryStatus({ data, stationId }: BatteryStatusProps) {
  const [congestionData, setCongestionData] = useState<CongestionData[]>([])
  const [chargingHistory, setChargingHistory] = useState<ChargingHistoryResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 배터리 퍼센트 값 (기본값 또는 API에서 가져온 값)
  const batteryPercentage = chargingHistory?.essValue
    ? Number.parseFloat(chargingHistory.essValue)
    : data?.batteryPercentage || 75

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // 병렬로 두 API 요청 실행
        const [congestionResult, chargingHistoryResult] = await Promise.all([
          fetchCongestionData(stationId),
          fetchChargingHistory(stationId),
        ])

        setCongestionData(congestionResult)
        setChargingHistory(chargingHistoryResult)
      } catch (err) {
        console.error("배터리 상태 데이터 로드 오류:", err)
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
      } finally {
        setLoading(false)
      }
    }

    if (stationId) {
      loadData()
    }
  }, [stationId])

  if (loading) {
    return (
      <div className="bg-zinc-800 rounded-lg p-4 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-4 border-b border-zinc-700 pb-2">ESS 배터리 상태</h3>
        <div className={loadingStyles.container}>
          <div className={loadingStyles.spinner}></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-zinc-800 rounded-lg p-4 flex flex-col h-full">
        <h3 className="text-lg font-bold mb-4 border-b border-zinc-700 pb-2">ESS 배터리 상태</h3>
        <div className={errorStyles.container}>{error}</div>
      </div>
    )
  }

  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-4 border-b border-zinc-700 pb-2">ESS 배터리 상태</h3>

      <div className="mb-6 flex justify-center">
        <div className="relative w-48 h-20 border-2 border-white rounded-r-full rounded-l-full flex items-center justify-center">
          <div
            className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-l-full"
            style={{ width: `${batteryPercentage}%` }}
          ></div>
          <span className="relative z-10 text-xl font-bold">{batteryPercentage}%</span>
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-white rounded-r-sm"></div>
        </div>
      </div>

      <h3 className="text-md font-bold mb-2 border-b border-zinc-700 pb-2">충전 정보</h3>
      <div className="grid grid-cols-4 text-center text-xs border-b border-zinc-700 py-1">
        <div>충전 시작</div>
        <div>충전 완료</div>
        <div>거래금액</div>
        <div>트랜잭션 ID</div>
      </div>
      {chargingHistory &&
        chargingHistory.records.map((record, index) => (
          <div key={index} className="grid grid-cols-4 text-center text-xs border-b border-zinc-700 py-1">
            <div>{formatDate(record.startTime)}</div>
            <div>{formatDate(record.endTime)}</div>
            <div>{record.priceKRW.toLocaleString()} KRW</div>
            <div>{record.transactionId}</div>
          </div>
        ))}

      <h3 className="text-md font-bold mt-4 mb-2 border-b border-zinc-700 pb-2">충전 시간대 정보</h3>
      <div className="h-32 bg-zinc-800 rounded-lg p-2 relative">
        {/* 그래프 제목 */}
        <div className="absolute top-2 left-2 flex items-center justify-between w-full pr-4">
          <span className="text-xs font-medium">혼잡 시간대 정보</span>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-pink-500 mr-1"></div>
            <span className="text-xs text-pink-500">피크 혼잡 시간</span>
          </div>
        </div>

        {/* 그래프 배경 - 점선 그리드 */}
        <div className="absolute inset-0 top-8 flex flex-col justify-between px-2">
          <div className="border-b border-dashed border-zinc-600 h-0"></div>
          <div className="border-b border-dashed border-zinc-600 h-0"></div>
          <div className="border-b border-dashed border-zinc-600 h-0"></div>
          <div className="border-b border-zinc-600 h-0"></div>
        </div>

        {/* X축 레이블 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-zinc-400 px-2">
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

        {/* 그래프 바 */}
        <div className="absolute inset-0 pt-8 pb-4 flex items-end px-2">
          <div className="w-full flex items-end justify-between">
            {congestionData.map((hourData) => (
              <div
                key={hourData.hour}
                className={`w-[6px] mx-[1px] ${hourData.isPeak ? "bg-pink-500" : "bg-gray-400"} rounded-t-sm`}
                style={{
                  height: hourData.count > 0 ? `${Math.min(hourData.count * 20, 80)}%` : "2px",
                }}
                title={`${hourData.hour}시: ${hourData.count}건 ${hourData.isPeak ? "(피크)" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex justify-center mt-2 text-xs">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-500 mr-1"></div>
          <span>일반 시간대</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-500 mr-1"></div>
          <span>피크 시간대</span>
        </div>
      </div>
    </div>
  )
}
