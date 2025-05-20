"use client"

import { useState, useEffect } from "react"
import type { MockDataType } from "@/types/station"
import type { CongestionData, ChargingHistoryResponse } from "@/types/api"
import { fetchCongestionData, fetchChargingHistory } from "@/services/chargerApi"
import { formatDate } from "@/lib/utils/date-utils"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface BatteryStatusProps {
  data?: MockDataType
  stationId: string
}

export function BatteryStatus({ data, stationId }: BatteryStatusProps) {
  const [congestionData, setCongestionData] = useState<CongestionData[]>([])
  const [chargingHistory, setChargingHistory] = useState<ChargingHistoryResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 배터리 퍼센트 값 (기본값 또는 API서 가져온 값)
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

        console.log("혼잡도 데이터:", congestionResult)
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
        <div className="relative flex items-center">
          {/* Main battery body */}
          <div className="relative w-48 h-20 border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
            {/* Battery fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-full"
              style={{
                width: `${Math.min(batteryPercentage, 100)}%`,
                transition: "width 0.5s ease-in-out",
              }}
            ></div>
            {/* Battery percentage text */}
            <span className="relative z-10 text-xl font-bold">{batteryPercentage}%</span>
          </div>
          {/* Battery terminal */}
          <div className="h-10 w-3 bg-white rounded-r-md ml-1 border-2 border-white"></div>
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

      <h3 className="text-md font-bold mt-4 mb-2 border-b border-zinc-700 pb-2">혼잡 시간대 정보</h3>
      <div className="h-60 bg-zinc-900 rounded-lg p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={congestionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              dataKey="hour"
              tickFormatter={(v) => String(v).padStart(2, "0")}
              tick={{ fontSize: 10, fill: "#ccc" }}
              interval={1}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: "#222", border: "none" }}
              labelFormatter={(label) => `${label}시`}
              formatter={(value: any) => [`${value}건`, "혼잡도"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#ccc"
              strokeWidth={2}
              dot={({ cx, cy, payload, index }) => (
                <circle key={`dot-${index}`} cx={cx} cy={cy} r={4} fill={payload.isPeak ? "#f472b6" : "#999"} />
              )}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 범례 */}
      <div className="flex justify-center mt-2 text-xs">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-gray-400 mr-1 rounded-full"></div>
          <span>일반 시간대</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-pink-500 mr-1 rounded-full"></div>
          <span>피크 시간대</span>
        </div>
      </div>
    </div>
  )
}
