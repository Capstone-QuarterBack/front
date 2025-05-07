"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StationLegend } from "@/components/overview/StationLegend";
import { KakaoMap } from "@/components/overview/KakaoMap";
import { fetchStationOverview, type StationOverviewData } from "@/services/api";
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils";

export default function StationMapOverview() {
  const [stations, setStations] = useState<StationOverviewData[]>([]);
  const [filteredStations, setFilteredStations] = useState<
    StationOverviewData[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStation, setSelectedStation] =
    useState<StationOverviewData | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // 데이터 로드 함수
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("충전소 데이터 로드 시작 (시도:", retryCount + 1, ")");
      const data = await fetchStationOverview();
      console.log("충전소 데이터 로드 완료:", data);

      if (!data || data.length === 0) {
        throw new Error("충전소 데이터가 없습니다.");
      }

      // 모든 충전소 데이터 설정
      setStations(data);
      setFilteredStations(data);
    } catch (err) {
      console.error("충전소 데이터 로드 오류:", err);
      setError(
        `데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`
      );

      // 최대 3번까지 재시도
      if (retryCount < 3) {
        console.log(`${retryCount + 1}번 재시도 중...`);
        setRetryCount((prev) => prev + 1);
        setTimeout(loadData, 2000); // 2초 후 재시도
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // 초기 데이터 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 검색 처리
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredStations(stations);
      return;
    }

    const filtered = stations.filter((station) =>
      station.stationName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredStations(filtered);

    if (filtered.length === 0) {
      alert("검색 결과가 없습니다.");
    }
  };

  // 검색어 초기화
  const resetSearch = () => {
    setSearchTerm("");
    setFilteredStations(stations);
  };

  // 충전소 선택 처리
  const handleStationSelect = (station: StationOverviewData) => {
    console.log("선택된 충전소:", station);
    setSelectedStation(station);
  };

  // 충전소 상세 정보 보기 - 이 함수는 더 이상 사용하지 않음
  // 대신 KakaoMap 컴포넌트 내부에서 직접 처리
  const handleViewStationDetails = () => {
    if (!selectedStation) return;

    // 충전소 데이터를 URL 파라미터로 전달
    const stationOverviewData = {
      stationId: selectedStation.stationId,
      stationName: selectedStation.stationName,
      latitude: selectedStation.latitude,
      longitude: selectedStation.longitude,
      status: selectedStation.status,
    };

    // 충전소 데이터를 URL 파라미터로 전달
    const stationData = encodeURIComponent(JSON.stringify(stationOverviewData));

    // 새 창에서 충전소 상세 정보 페이지 열기
    const width = Math.min(1400, window.screen.width * 0.9);
    const height = Math.min(900, window.screen.height * 0.9);
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      `/station-detail?stationData=${stationData}`,
      "stationDetail",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  // 데이터 다시 로드
  const handleRefresh = () => {
    setRetryCount(0);
    loadData();
  };

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
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              className="absolute right-0 top-0 h-9"
              onClick={handleSearch}
            >
              검색
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <StationLegend />
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleRefresh}
            >
              새로고침
            </Button>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className={loadingStyles.container}>
              <div className={loadingStyles.spinner}></div>
            </div>
          ) : error ? (
            <div className={errorStyles.container}>
              <div className="text-red-500 mb-4">{error}</div>
              <Button onClick={handleRefresh}>다시 시도</Button>
            </div>
          ) : (
            <KakaoMap
              stations={filteredStations}
              onSelectStation={handleStationSelect}
              selectedStation={selectedStation}
            />
          )}
        </div>

        {/* 선택된 충전소 정보 */}
        {selectedStation && (
          <div className="absolute bottom-4 right-4 bg-zinc-800 p-3 rounded-md shadow-md max-w-xs z-10">
            <h3 className="font-bold mb-1">{selectedStation.stationName}</h3>
            <p className="text-xs mb-2">ID: {selectedStation.stationId}</p>
            <Button
              className="w-full bg-zinc-700 hover:bg-zinc-600 text-xs py-1"
              onClick={handleViewStationDetails}
            >
              상세 정보 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
