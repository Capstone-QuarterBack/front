"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { CustomCard } from "@/components/ui/CustomCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchStations, type StationData } from "@/services/api";
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils";
import { formatDate } from "@/lib/utils/date-utils";
import { StationStatusIndicator } from "@/components/dashboard/StationStatusIndicator";

export function StationInfo({ className = "", refreshInterval = 0 }) {
  const [stations, setStations] = useState<StationData[]>([]);
  const [filteredStations, setFilteredStations] = useState<StationData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      console.log("StationInfo: 데이터 로드 시작");
      setIsLoading(true);
      setError(null);

      const stationData = await fetchStations();
      console.log("StationInfo: 받은 데이터:", stationData);

      if (!stationData || stationData.length === 0) {
        console.warn("StationInfo: 데이터가 비어 있습니다.");
      }

      setStations(stationData);
      setFilteredStations(stationData);
    } catch (err) {
      console.error("StationInfo: 데이터 로드 오류:", err);
      setError(
        `데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`
      );
    } finally {
      setIsLoading(false);
      console.log("StationInfo: 데이터 로드 완료");
    }
  };

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("StationInfo: 컴포넌트 마운트, 데이터 로드 시작");
    loadData();

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshInterval > 0) {
      console.log(
        `StationInfo: ${refreshInterval}ms 간격으로 자동 새로고침 설정`
      );
      intervalId = setInterval(loadData, refreshInterval);
    }

    return () => {
      if (intervalId) {
        console.log("StationInfo: 자동 새로고침 정리");
        clearInterval(intervalId);
      }
    };
  }, [refreshInterval]);

  // 검색어 변경 시 필터링
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(
        (station) =>
          station.stationName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          station.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStations(filtered);
    }
  }, [searchTerm, stations]);

  // 충전소 상태에 따른 스타일 반환
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-zinc-800 text-green-500";
      case "INACTIVE":
        return "bg-zinc-900 text-red-500";
      case "MAINTENANCE":
        return "bg-zinc-800 text-amber-500";
      default:
        return "bg-zinc-800 text-zinc-400";
    }
  };

  // 충전소 클릭 핸들러
  const handleViewStationDetails = (station: StationData) => {
    // 충전소 데이터를 URL 파라미터로 전달
    const stationOverviewData = {
      stationId: station.stationId,
      stationName: station.stationName,
      latitude: 37.5665, // 기본값 (실제로는 API에서 가져와야 함)
      longitude: 126.978, // 기본값 (실제로는 API에서 가져와야 함)
      status: station.stationStatus,
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

  return (
    <CustomCard
      title="등록 충전소 정보"
      className={className}
      headerRight={
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              className="pl-8 h-8 bg-zinc-700 border-zinc-600 text-sm w-full sm:w-[200px] md:w-[250px]"
              placeholder="충전소를 입력해주세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              Add Station
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs">
              Delete Station
            </Button>
          </div>
        </div>
      }
    >
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px] overflow-auto">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : filteredStations.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-400">
            등록된 충전소가 없거나 검색 결과가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {filteredStations.map((station) => (
                  <tr
                    key={station.stationId}
                    className={`${getStatusStyle(station.stationStatus)}`}
                  >
                    <td className="py-3 pl-3">
                      <div>{station.stationStatus}</div>
                    </td>
                    <td className="py-3">
                      <div>{station.stationName}</div>
                      <div className="text-xs text-zinc-400">
                        ID: {station.stationId}
                      </div>
                    </td>
                    <td className="py-3">
                      <div>{station.address}</div>
                    </td>
                    <td className="py-3">
                      Regist Date {formatDate(station.regDate)}
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center justify-between">
                        <StationStatusIndicator
                          available={station.avaliableCount}
                          occupied={station.occupiedCount}
                          unavailable={station.unAvaliableCount}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 text-xs h-7 px-2"
                          onClick={() => handleViewStationDetails(station)}
                        >
                          상세 정보 보기
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomCard>
  );
}
