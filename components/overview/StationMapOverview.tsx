"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { StationLegend } from "@/components/overview/StationLegend"
// Import the KakaoMap component instead of SimpleMap
import { KakaoMap } from "@/components/overview/KakaoMap"
import { fetchStationOverview, type StationOverviewData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"

export default function StationMapOverview() {
  const [stations, setStations] = useState<StationOverviewData[]>([])
  const [filteredStations, setFilteredStations] = useState<StationOverviewData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedStation, setSelectedStation] = useState<StationOverviewData | null>(null)

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await fetchStationOverview()
      setStations(data)
      setFilteredStations(data)
    } catch (err) {
      console.error("충전소 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    loadData()
  }, [])

  // 검색 처리
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredStations(stations)
      return
    }

    const filtered = stations.filter((station) => station.stationName.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredStations(filtered)

    if (filtered.length === 0) {
      alert("검색 결과가 없습니다.")
    }
  }

  // 검색어 초기화
  const resetSearch = () => {
    setSearchTerm("")
    setFilteredStations(stations)
  }

  // 충전소 선택 처리
  const handleStationSelect = (station: StationOverviewData) => {
    setSelectedStation(station)
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="overview" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 검색 및 범례 */}
        <div className="p-3 md:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 z-10">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              className="pl-8 h-9 bg-zinc-800 border-zinc-700 w-full sm:w-64"
              placeholder="검색할 충전소를 입력하세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
                onClick={resetSearch}
              >
                ×
              </Button>
            )}
            <Button className="absolute right-0 top-0 h-9" onClick={handleSearch}>
              검색
            </Button>
          </div>
          <StationLegend />
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className={loadingStyles.container}>
              <div className={loadingStyles.spinner}></div>
            </div>
          ) : error ? (
            <div className={errorStyles.container}>{error}</div>
          ) : (
            <KakaoMap
              stations={filteredStations}
              onSelectStation={handleStationSelect}
              selectedStation={selectedStation}
            />
          )}
        </div>
      </div>
    </div>
  )
}
