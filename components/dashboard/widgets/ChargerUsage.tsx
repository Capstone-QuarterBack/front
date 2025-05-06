"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { fetchChargerUsage, type ChargerUsageData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { formatDate } from "@/lib/utils/date-utils"

interface ChargerUsageProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function ChargerUsage({ className = "", refreshInterval = 0 }: ChargerUsageProps) {
  const [data, setData] = useState<ChargerUsageData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      console.log("ChargerUsage: 데이터 로드 시작")
      setIsLoading(true)
      setError(null)

      const chargerData = await fetchChargerUsage()
      console.log("ChargerUsage: 받은 데이터:", chargerData)

      if (!chargerData || chargerData.length === 0) {
        throw new Error("데이터가 비어 있습니다.")
      }

      setData(chargerData)
    } catch (err) {
      console.error("ChargerUsage: 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
      console.log("ChargerUsage: 데이터 로드 완료")
    }
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("ChargerUsage: 컴포넌트 마운트, 데이터 로드 시작")
    loadData()

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      console.log(`ChargerUsage: ${refreshInterval}ms 간격으로 자동 새로고침 설정`)
      intervalId = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (intervalId) {
        console.log("ChargerUsage: 자동 새로고침 정리")
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval])

  // 충전기 상태에 따른 스타일 반환
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "text-green-500"
      case "INACTIVE":
        return "text-red-500"
      case "MAINTENANCE":
        return "text-amber-500"
      default:
        return "text-zinc-400"
    }
  }

  // 충전기 상태 표시기 렌더링
  const renderStatusIndicators = (available: number, occupied: number, unavailable: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="bg-green-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {available}
        </div>
        <div className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {occupied}
        </div>
        <div className="bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
          {unavailable}
        </div>
        <div className="bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">0</div>
      </div>
    )
  }

  // 충전기 상세 정보 페이지로 이동하는 함수
  const handleChargerClick = (chargerId: string, chargerNumber: string, status: string) => {
    // 충전기 데이터를 URL 파라미터로 전달
    const chargerData = {
      stationId: chargerId,
      stationName: chargerNumber,
      latitude: 37.5665, // 기본값 (실제로는 API에서 가져와야 함)
      longitude: 126.978, // 기본값 (실제로는 API에서 가져와야 함)
      status: status,
    }

    // 충전기 데이터를 URL 파라미터로 인코딩
    const stationData = encodeURIComponent(JSON.stringify(chargerData))

    // 새 창에서 충전소 상세 정보 페이지 열기
    const width = Math.min(1400, window.screen.width * 0.9)
    const height = Math.min(900, window.screen.height * 0.9)
    const left = (window.screen.width - width) / 2
    const top = (window.screen.height - height) / 2

    window.open(
      `/station-detail?stationData=${stationData}`,
      "stationDetail",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`,
    )
  }

  return (
    <Card title="충전기 사용 정보" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : (
          <div className="overflow-auto h-full">
            <table className="w-full text-sm">
              <tbody>
                {data.map((item, index) => {
                  // 모의 데이터 - 실제 구현에서는 API에서 가져와야 함
                  const status = index % 2 === 0 ? "ACTIVE" : "INACTIVE"
                  const statusClass = getStatusStyle(status)
                  const chargerId = `charger-${index.toString().padStart(3, "0")}`

                  return (
                    <tr key={index} className="border-b border-zinc-700 hover:bg-zinc-800">
                      <td className={`py-3 pl-3 ${statusClass}`}>{status}</td>
                      <td className="py-3">
                        <div
                          className="cursor-pointer hover:text-amber-500"
                          onClick={() => handleChargerClick(chargerId, item.chargerNumber, status)}
                        >
                          {item.chargerNumber}
                          <div className="text-xs text-zinc-400">ID: {chargerId}</div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div>{item.chargerLocation}</div>
                      </td>
                      <td className="py-3">Regist Date {formatDate(item.timestamp)}</td>
                      <td className="py-3 pr-3">{renderStatusIndicators(1, 1, 1)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  )
}
