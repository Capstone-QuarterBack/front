"use client"

import { useEffect, useState } from "react"
import type { StationOverviewData } from "@/types/station"
import type { ChargerStatusInfo, ChargerInfoResponse } from "@/types/api"
import { mockData } from "@/data/mockData"
import { BatteryStatus } from "./BatteryStatus"
import { ChargerPanel } from "./ChargerPanel"
import { fetchChargerStatuses, fetchChargerInfo } from "@/services/chargerApi"
import { loadingStyles } from "@/lib/utils/style-utils"
// Import the KakaoMap component
import { KakaoMap } from "@/components/overview/KakaoMap"

export default function StationDetailPage() {
  const [station, setStation] = useState<StationOverviewData | null>(null)
  const [chargerStatuses, setChargerStatuses] = useState<ChargerStatusInfo[]>([])
  const [chargerInfoMap, setChargerInfoMap] = useState<Map<number, ChargerInfoResponse>>(new Map())
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  // Add a mapStations state to store the selected station for the map
  // Add this after the other useState declarations:
  const [mapStations, setMapStations] = useState<StationOverviewData[]>([])

  // URL에서 충전소 데이터 가져오기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stationData = params.get("stationData")

    if (stationData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(stationData))
        console.log("URL에서 가져온 충전소 데이터:", decodedData)
        setStation(decodedData)
      } catch (error) {
        console.error("충전소 데이터 파싱 오류:", error)
        setError("충전소 데이터를 불러오는 중 오류가 발생했습니다.")
      }
    } else {
      setError("URL에서 충전소 데이터를 찾을 수 없습니다.")
    }
  }, [])

  // 충전소 정보가 있으면 충전기 상태 정보 가져오기
  useEffect(() => {
    if (!station) return

    const loadChargerStatuses = async () => {
      try {
        setLoading(true)
        console.log(`충전소 ${station.stationId}의 충전기 상태 정보 요청 시작`)
        const statuses = await fetchChargerStatuses(station.stationId)
        console.log(`충전소 ${station.stationId}의 충전기 상태 정보 수신 완료:`, statuses)
        setChargerStatuses(statuses)
      } catch (error) {
        console.error("충전기 상태 정보 로드 오류:", error)
        setError("충전기 상태 정보를 불러오는 중 오류가 발생했습니다.")

        // 오류 발생 시 모의 데이터 사용
        console.log("오류 발생으로 모의 충전기 상태 데이터 사용")
        setChargerStatuses([
          { evseId: 1, chargerStatus: "AVAILABLE" },
          { evseId: 2, chargerStatus: "OCCUPIED" },
          { evseId: 3, chargerStatus: "UNAVAILABLE" },
          { evseId: 4, chargerStatus: "AVAILABLE" },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadChargerStatuses()
  }, [station])

  // 충전기 상태 정보가 있으면 각 충전기의 상세 정보 가져오기
  useEffect(() => {
    if (!station || chargerStatuses.length === 0) return

    const loadChargerDetails = async () => {
      try {
        setLoading(true)
        const infoMap = new Map<number, ChargerInfoResponse>()

        console.log(`${chargerStatuses.length}개 충전기의 상세 정보 요청 시작`)

        // 각 충전기에 대해 병렬로 API 호출 실행
        const promises = chargerStatuses.map(async (status) => {
          try {
            // 충전기 상태에 따라 다른 엔드포인트 호출
            let statusType: "available" | "occupied" | "unavailable"

            switch (status.chargerStatus) {
              case "AVAILABLE":
                statusType = "available"
                break
              case "OCCUPIED":
                statusType = "occupied"
                break
              case "UNAVAILABLE":
              default:
                statusType = "unavailable"
                break
            }

            console.log(`충전기 ${status.evseId}의 상세 정보 요청 중... (상태: ${statusType})`)

            const info = await fetchChargerInfo(station.stationId, status.evseId, statusType)
            console.log(`충전기 ${status.evseId}의 상세 정보 수신 완료:`, info)

            infoMap.set(status.evseId, info)
          } catch (fetchError) {
            console.error(`충전기 ${status.evseId} 정보 요청 실패:`, fetchError)
            // 개별 충전기 오류는 전체 프로세스를 중단하지 않음
          }
        })

        // 모든 API 호출이 완료될 때까지 대기
        await Promise.all(promises)
        console.log("모든 충전기 상세 정보 로드 완료, 총 충전기 수:", infoMap.size)

        setChargerInfoMap(infoMap)
      } catch (error) {
        console.error("충전기 상세 정보 로드 오류:", error)
        setError("충전기 상세 정보를 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    loadChargerDetails()
  }, [chargerStatuses, station])

  // Add this effect to update mapStations when station changes
  // Add this after the other useEffect hooks:
  useEffect(() => {
    if (station) {
      setMapStations([station])
    }
  }, [station])

  // 로딩 중이거나 오류 발생 시 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className={loadingStyles.spinner}></div>
      </div>
    )
  }

  if (error || !station) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        <div className="text-red-500">{error || "충전소 정보를 불러올 수 없습니다."}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-[1400px] mx-auto p-4">
        {/* 헤더 */}
        <div className="text-center p-4 border-b border-zinc-700 mb-4">
          <h2 className="text-2xl font-bold">{station.stationName}</h2>
          <p className="text-sm text-zinc-400">충전소 ID: {station.stationId}</p>
        </div>

        {/* 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 왼쪽 패널 - ESS 배터리 상태 */}
          <div>
            <BatteryStatus stationId={station.stationId} data={mockData} />
          </div>

          {/* 중앙 및 오른쪽 패널 - 충전기 상태 및 요약 정보 */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chargerStatuses.map((status) => {
                // 각 충전기의 ID에 해당하는 API 응답 데이터 가져오기
                const chargerInfo = chargerInfoMap.get(status.evseId)
                console.log(`충전기 ${status.evseId} 정보 렌더링:`, chargerInfo)

                // 충전기 상태에 따른 텍스트 설정
                let statusText = "사용가능"
                if (status.chargerStatus === "OCCUPIED") {
                  statusText = "이용중"
                } else if (status.chargerStatus === "UNAVAILABLE") {
                  statusText = "사용불가"
                }

                return (
                  <ChargerPanel
                    key={status.evseId}
                    charger={{
                      id: status.evseId.toString(),
                      status: status.chargerStatus,
                      statusText: statusText,
                    }}
                    data={mockData}
                    apiData={chargerInfo}
                    showDetails={true}
                    showSummary={status.chargerStatus === "AVAILABLE"}
                  />
                )
              })}
            </div>
          </div>
          {/* 지도 영역 - 추가 */}
          <div className="lg:col-span-3 mb-4">
            <div className="bg-zinc-800 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-4">충전소 위치</h3>
              <div className="h-[300px]">
                {station && <KakaoMap stations={mapStations} onSelectStation={() => {}} selectedStation={station} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
