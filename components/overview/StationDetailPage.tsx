"use client"

import { useEffect, useState } from "react"
import type { StationOverviewData } from "@/types/station"
import { mockData } from "@/data/mockData"
import { BatteryStatus } from "./BatteryStatus"
import { ChargerPanel } from "./ChargerPanel"

export default function StationDetailPage() {
  const [station, setStation] = useState<StationOverviewData | null>(null)

  useEffect(() => {
    // URL에서 충전소 데이터 파라미터 가져오기
    const params = new URLSearchParams(window.location.search)
    const stationData = params.get("stationData")

    if (stationData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(stationData))
        setStation(decodedData)
      } catch (error) {
        console.error("충전소 데이터 파싱 오류:", error)
      }
    }
  }, [])

  if (!station) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* 헤더 */}
        <div className="text-center p-4 border-b border-zinc-700 mb-4">
          <h2 className="text-2xl font-bold">{station.stationName}</h2>
        </div>

        {/* 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 왼쪽 패널 - ESS 배터리 상태 */}
          <div>
            <BatteryStatus data={mockData} />
          </div>

          {/* 중앙 및 오른쪽 패널 - 충전기 상태 및 요약 정보 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 충전기 01 - 사용가능 상태이므로 과거 데이터와 월별 사용 내역 포함 */}
              <ChargerPanel charger={mockData.chargers[0]} data={mockData} showDetails={true} showSummary={true} />

              {/* 충전기 02 - 사용중 상태이므로 현재 충전 정보와 과거 사용 내역 표시 */}
              <ChargerPanel charger={mockData.chargers[1]} data={mockData} showDetails={true} />

              {/* 충전기 03 - 사용중 상태이므로 현재 충전 정보와 과거 사용 내역 표시 */}
              <ChargerPanel charger={mockData.chargers[2]} data={mockData} showDetails={true} />

              {/* 충전기 04 - 사용중 상태이므로 현재 충전 정보와 과거 사용 내역 표시 */}
              <ChargerPanel charger={mockData.chargers[3]} data={mockData} showDetails={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
