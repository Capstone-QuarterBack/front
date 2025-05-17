"use client";

import { useState } from "react";
import type { Station, Charger } from "./StationVisualization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Search,
  Power,
  PowerOff,
  PenToolIcon as Tool,
  Zap,
} from "lucide-react";

interface StationControlPanelProps {
  stations: Station[];
  selectedStation: Station | null;
  selectedCharger: Charger | null;
  onSelectStation: (station: Station) => void;
  onSelectCharger: (station: Station, charger: Charger) => void;
  onToggleStationStatus: (stationId: string) => void;
  onToggleChargerStatus: (stationId: string, chargerId: string) => void;
  loading: boolean;
  error: string | null;
}

export function StationControlPanel({
  stations,
  selectedStation,
  selectedCharger,
  onSelectStation,
  onSelectCharger,
  onToggleStationStatus,
  onToggleChargerStatus,
  loading,
  error,
}: StationControlPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("stations");

  // 충전소 상태 변경 핸들러
  const handleToggleStationStatus = (
    stationId: string,
    currentStatus: string
  ) => {
    onToggleStationStatus(stationId);

    // 로그 추가
    const station = stations.find((s) => s.id === stationId);
    if (station) {
      const newStatus = currentStatus === "active" ? "비활성화" : "활성화";
      const logMessage = `${new Date().toLocaleTimeString()} - ${
        station.name
      } 충전소가 ${newStatus}되었습니다.`;
      setLogs((prev) => [logMessage, ...prev].slice(0, 10)); // 최근 10개 로그만 유지
    }
  };

  // 충전기 상태 변경 핸들러
  const handleToggleChargerStatus = (
    stationId: string,
    chargerId: string,
    currentStatus: string
  ) => {
    onToggleChargerStatus(stationId, chargerId);

    // 로그 추가
    const station = stations.find((s) => s.id === stationId);
    if (station) {
      const charger = station.chargers.find((c) => c.id === chargerId);
      if (charger) {
        const newStatus =
          currentStatus === "charging" || currentStatus === "available"
            ? "비활성화"
            : "활성화";
        const logMessage = `${new Date().toLocaleTimeString()} - ${
          station.name
        }의 ${charger.name}가 ${newStatus}되었습니다.`;
        setLogs((prev) => [logMessage, ...prev].slice(0, 10)); // 최근 10개 로그만 유지
      }
    }
  };

  // 검색 필터링
  const filteredStations = stations.filter((station) =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">활성화</Badge>;
      case "disabled":
        return <Badge className="bg-red-500">비활성화</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">점검 중</Badge>;
      case "available":
        return <Badge className="bg-green-500">사용 가능</Badge>;
      case "charging":
        return <Badge className="bg-blue-500">충전 중</Badge>;
      default:
        return <Badge>알 수 없음</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">충전소 제어 패널</h2>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="충전소 검색..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <AlertCircle className="inline-block mr-2 h-4 w-4" />
          {error}
        </div>
      )}

      {/* 로딩 상태 */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Tabs
          defaultValue="stations"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stations">충전소</TabsTrigger>
            <TabsTrigger value="chargers">충전기</TabsTrigger>
          </TabsList>

          {/* 충전소 탭 */}
          <TabsContent value="stations" className="space-y-4">
            {/* 충전소 목록 */}
            <div className="space-y-2 max-h-[30vh] overflow-y-auto">
              {filteredStations.map((station) => (
                <Card
                  key={station.id}
                  className={`cursor-pointer transition-all ${
                    selectedStation?.id === station.id
                      ? "border-blue-500 shadow-md"
                      : ""
                  }`}
                  onClick={() => onSelectStation(station)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{station.name}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span>
                            충전 중: {station.chargingCars}/
                            {station.maxCapacity}
                          </span>
                          {getStatusBadge(station.status)}
                        </div>
                      </div>
                      <Button
                        variant={
                          station.status === "active"
                            ? "destructive"
                            : "default"
                        }
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStationStatus(station.id, station.status);
                        }}
                      >
                        {station.status === "active" ? (
                          <>
                            <PowerOff className="h-4 w-4 mr-1" />
                            충전 금지
                          </>
                        ) : (
                          <>
                            <Power className="h-4 w-4 mr-1" />
                            충전 허용
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 선택된 충전소 상세 정보 */}
            {selectedStation && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedStation.name} 상세 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">상태:</span>
                      {getStatusBadge(selectedStation.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">충전 중인 차량:</span>
                      <span>
                        {selectedStation.chargingCars}/
                        {selectedStation.maxCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">충전기 수:</span>
                      <span>{selectedStation.chargers.length}</span>
                    </div>

                    <Button
                      className="w-full mt-2"
                      variant={
                        selectedStation.status === "active"
                          ? "destructive"
                          : "default"
                      }
                      onClick={() =>
                        handleToggleStationStatus(
                          selectedStation.id,
                          selectedStation.status
                        )
                      }
                    >
                      {selectedStation.status === "active"
                        ? "충전 금지로 변경"
                        : "충전 허용으로 변경"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 충전기 탭 */}
          <TabsContent value="chargers" className="space-y-4">
            {selectedStation ? (
              <>
                <div className="bg-blue-100 p-3 rounded">
                  <h3 className="font-medium">
                    {selectedStation.name}의 충전기
                  </h3>
                </div>

                {/* 충전기 목록 */}
                <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                  {selectedStation.chargers.map((charger) => (
                    <Card
                      key={charger.id}
                      className={`cursor-pointer transition-all ${
                        selectedCharger?.id === charger.id
                          ? "border-blue-500 shadow-md"
                          : ""
                      }`}
                      onClick={() => onSelectCharger(selectedStation, charger)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{charger.name}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{charger.power}kW</span>
                              {getStatusBadge(charger.status)}
                            </div>
                          </div>
                          <Button
                            variant={
                              charger.status === "charging" ||
                              charger.status === "available"
                                ? "destructive"
                                : "default"
                            }
                            size="sm"
                            disabled={selectedStation.status !== "active"}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChargerStatus(
                                selectedStation.id,
                                charger.id,
                                charger.status
                              );
                            }}
                          >
                            {charger.status === "charging" ||
                            charger.status === "available" ? (
                              <>
                                <PowerOff className="h-4 w-4 mr-1" />
                                정지
                              </>
                            ) : (
                              <>
                                <Power className="h-4 w-4 mr-1" />
                                활성화
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 선택된 충전기 상세 정보 */}
                {selectedCharger && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedCharger.name} 상세 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">상태:</span>
                          {getStatusBadge(selectedCharger.status)}
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">출력:</span>
                          <span>{selectedCharger.power}kW</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">커넥터 타입:</span>
                          <span>{selectedCharger.connectorType}</span>
                        </div>
                        {selectedCharger.currentCar && (
                          <div className="flex justify-between">
                            <span className="font-medium">충전 중인 차량:</span>
                            <span>{selectedCharger.currentCar}</span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Button
                            variant={
                              selectedCharger.status === "charging" ||
                              selectedCharger.status === "available"
                                ? "destructive"
                                : "default"
                            }
                            disabled={selectedStation.status !== "active"}
                            onClick={() =>
                              handleToggleChargerStatus(
                                selectedStation.id,
                                selectedCharger.id,
                                selectedCharger.status
                              )
                            }
                          >
                            {selectedCharger.status === "charging" ||
                            selectedCharger.status === "available"
                              ? "정지"
                              : "활성화"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              // 점검 모드로 변경하는 로직 (여기서는 로그만 추가)
                              const logMessage = `${new Date().toLocaleTimeString()} - ${
                                selectedStation.name
                              }의 ${
                                selectedCharger.name
                              }가 점검 모드로 변경되었습니다.`;
                              setLogs((prev) =>
                                [logMessage, ...prev].slice(0, 10)
                              );
                            }}
                          >
                            <Tool className="h-4 w-4 mr-1" />
                            점검 모드
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Zap className="h-8 w-8 mb-2" />
                <p>충전소를 선택하면 충전기 목록이 표시됩니다.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 로그 */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm">작업 로그</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1 max-h-[15vh] overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-gray-600">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-400">로그가 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
