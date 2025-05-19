"use client"

import { useState } from "react"
import type { Station, Charger } from "./StationVisualization"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Search, Zap, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StationControlPanelProps {
  stations: Station[]
  selectedStation: Station | null
  selectedCharger: Charger | null
  onSelectStation: (station: Station) => void
  onSelectCharger: (station: Station, charger: Charger) => void
  onToggleStationStatus: (stationId: string) => void
  onToggleChargerStatus: (stationId: string, chargerId: string) => void
  loading: boolean
  error: string | null
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
  const [searchTerm, setSearchTerm] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("stations")

  // 충전기 상태 변경 핸들러
  const handleToggleChargerStatus = (stationId: string, chargerId: string, currentStatus: string) => {
    // 충전소가 비활성화 상태인 경우 작업 불가
    const station = stations.find((s) => s.id === stationId)
    if (station && station.status !== "active") {
      const logMessage = `${new Date().toLocaleTimeString()} - ${station.name} 충전소가 비활성화 상태입니다. 충전기 상태를 변경할 수 없습니다.`
      setLogs((prev) => [logMessage, ...prev].slice(0, 10))
      return
    }

    onToggleChargerStatus(stationId, chargerId)

    // 로그 추가
    if (station) {
      const charger = station.chargers.find((c) => c.id === chargerId)
      if (charger) {
        let actionMessage = ""
        if (currentStatus === "charging") {
          actionMessage = "충전 정지됨"
        } else if (currentStatus === "available") {
          actionMessage = "비활성화됨"
        } else {
          actionMessage = "활성화됨"
        }

        const logMessage = `${new Date().toLocaleTimeString()} - ${station.name}의 ${charger.name}가 ${actionMessage}`
        setLogs((prev) => [logMessage, ...prev].slice(0, 10))
      }
    }
  }

  // 검색 필터링
  const filteredStations = stations.filter((station) => station.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white font-medium">활성화</Badge>
      case "disabled":
        return <Badge className="bg-red-500 text-white font-medium">비활성화</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500 text-white font-medium">점검 중</Badge>
      case "available":
        return <Badge className="bg-green-500 text-white font-medium">사용 가능</Badge>
      case "charging":
        return <Badge className="bg-blue-500 text-white font-medium">충전 중</Badge>
      default:
        return <Badge className="bg-gray-500 text-white font-medium">알 수 없음</Badge>
    }
  }

  // 충전기 상태에 따른 버튼 텍스트와 스타일
  const getChargerStatusButton = (status: string) => {
    switch (status) {
      case "charging":
        return {
          text: "충전 정지",
          variant: "destructive" as const,
          className: "bg-red-500 hover:bg-red-600 text-white",
        }
      case "available":
        return {
          text: "비활성화",
          variant: "destructive" as const,
          className: "bg-red-500 hover:bg-red-600 text-white",
        }
      case "disabled":
        return {
          text: "활성화",
          variant: "default" as const,
          className: "bg-green-500 hover:bg-green-600 text-white",
        }
      default:
        return {
          text: "상태 변경",
          variant: "default" as const,
          className: "bg-blue-500 hover:bg-blue-600 text-white",
        }
    }
  }

  return (
    <div className="space-y-4 text-gray-900">
      <h2 className="text-2xl font-bold text-black">충전소 제어 패널</h2>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="충전소 검색..."
          className="pl-8 bg-white text-black border-gray-300"
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
          className="bg-white rounded-md p-1"
        >
          <TabsList className="grid w-full grid-cols-2 bg-gray-100">
            <TabsTrigger value="stations" className="text-black font-medium">
              충전소
            </TabsTrigger>
            <TabsTrigger value="chargers" className="text-black font-medium">
              충전기
            </TabsTrigger>
          </TabsList>

          {/* 충전소 탭 */}
          <TabsContent value="stations" className="space-y-4">
            {/* 충전소 목록 */}
            <div className="space-y-2 max-h-[30vh] overflow-y-auto">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  className={`p-4 mb-4 border rounded-md cursor-pointer ${
                    selectedStation?.id === station.id ? "border-blue-500" : "border-gray-300"
                  } ${station.status === "disabled" ? "bg-gray-100" : "bg-white"}`}
                  onClick={() => onSelectStation(station)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-black">{station.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${
                        station.status === "active"
                          ? "bg-green-500 text-white"
                          : station.status === "disabled"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                      }`}
                    >
                      {station.status === "active" ? "활성화" : station.status === "disabled" ? "비활성화" : "점검중"}
                    </span>
                  </div>

                  {station.status === "disabled" && (
                    <div
                      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 mb-2 text-xs font-medium"
                      role="alert"
                    >
                      <p>이 충전소는 비활성화 상태입니다. 충전기를 조작할 수 없습니다.</p>
                    </div>
                  )}

                  <div className="text-sm font-medium text-gray-800">
                    충전 중: {station.chargingCars}/{station.maxCapacity}
                  </div>
                </div>
              ))}
            </div>

            {/* 선택된 충전소 상세 정보 */}
            {selectedStation && (
              <Card className="bg-white border-gray-300">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="text-black">{selectedStation.name} 상세 정보</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">상태:</span>
                      {getStatusBadge(selectedStation.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">충전 중인 차량:</span>
                      <span className="text-black font-medium">
                        {selectedStation.chargingCars}/{selectedStation.maxCapacity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">충전기 수:</span>
                      <span className="text-black font-medium">{selectedStation.chargers.length}</span>
                    </div>

                    {/* 충전소 상태 변경 버튼 제거됨 */}
                    {selectedStation.status !== "active" && (
                      <Alert className="mt-2 bg-amber-50 border border-amber-200">
                        <Info className="h-4 w-4 text-amber-500" />
                        <AlertDescription className="text-amber-800 font-medium">
                          이 충전소는 현재 {selectedStation.status === "disabled" ? "비활성화" : "점검 중"} 상태입니다.
                          충전기 상태를 변경할 수 없습니다.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* 충전기 탭 */}
          <TabsContent value="chargers" className="space-y-4">
            {selectedStation ? (
              <>
                <div className="bg-blue-100 p-3 rounded border border-blue-200">
                  <h3 className="font-medium text-blue-800">{selectedStation.name}의 충전기</h3>
                </div>

                {selectedStation.status !== "active" && (
                  <Alert className="bg-amber-50 border border-amber-200">
                    <Info className="h-4 w-4 text-amber-500" />
                    <AlertDescription className="text-amber-800 font-medium">
                      이 충전소는 현재 {selectedStation.status === "disabled" ? "비활성화" : "점검 중"} 상태입니다.
                      충전기 상태를 변경할 수 없습니다.
                    </AlertDescription>
                  </Alert>
                )}

                {/* 충전기 목록 */}
                <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                  {selectedStation.chargers.map((charger) => (
                    <div
                      key={charger.id}
                      className={`p-3 mb-2 rounded-md cursor-pointer border ${
                        selectedCharger?.id === charger.id
                          ? "bg-blue-50 border-blue-500"
                          : charger.status === "charging"
                            ? "bg-blue-50 border-blue-200"
                            : charger.status === "available"
                              ? "bg-green-50 border-green-200"
                              : charger.status === "disabled"
                                ? "bg-red-50 border-red-200"
                                : "bg-yellow-50 border-yellow-200"
                      } ${selectedStation.status === "disabled" ? "opacity-70" : ""}`}
                      onClick={() => onSelectCharger(selectedStation, charger)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{charger.name}</span>
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${
                            charger.status === "charging"
                              ? "bg-blue-500 text-white"
                              : charger.status === "available"
                                ? "bg-green-500 text-white"
                                : charger.status === "disabled"
                                  ? "bg-red-500 text-white"
                                  : "bg-yellow-500 text-white"
                          }`}
                        >
                          {charger.status === "charging"
                            ? "충전중"
                            : charger.status === "available"
                              ? "사용가능"
                              : charger.status === "disabled"
                                ? "사용불가"
                                : "점검중"}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mt-1">
                        {charger.power}kW · {charger.connectorType}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 선택된 충전기 상세 정보 */}
                {selectedCharger && (
                  <Card className="bg-white border-gray-300">
                    <CardHeader className="bg-gray-50 border-b border-gray-200">
                      <CardTitle className="text-black">{selectedCharger.name} 상세 정보</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">상태:</span>
                          {getStatusBadge(selectedCharger.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">출력:</span>
                          <span className="text-black font-medium">{selectedCharger.power}kW</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">커넥터 타입:</span>
                          <span className="text-black font-medium">{selectedCharger.connectorType}</span>
                        </div>
                        {selectedCharger.currentCar && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-800">충전 중인 차량:</span>
                            <span className="text-black font-medium">{selectedCharger.currentCar}</span>
                          </div>
                        )}

                        {/* 상태 변경 버튼 - 직접 스타일 적용 */}
                        <div className="mt-2">
                          <button
                            className={`w-full py-2 px-4 rounded-md font-medium ${
                              selectedStation.status !== "active"
                                ? "bg-gray-300 cursor-not-allowed opacity-60 text-gray-700"
                                : selectedCharger.status === "disabled"
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                            }`}
                            disabled={selectedStation.status !== "active"}
                            onClick={() =>
                              handleToggleChargerStatus(selectedStation.id, selectedCharger.id, selectedCharger.status)
                            }
                          >
                            {getChargerStatusButton(selectedCharger.status).text}
                          </button>
                        </div>

                        {selectedStation.status !== "active" && (
                          <Alert className="mt-2 bg-amber-50 border border-amber-200">
                            <Info className="h-4 w-4 text-amber-500" />
                            <AlertDescription className="text-amber-800 font-medium">
                              충전소가 비활성화 상태일 때는 충전기 상태를 변경할 수 없습니다.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 bg-white rounded-md p-4 border border-gray-200">
                <Zap className="h-8 w-8 mb-2 text-gray-500" />
                <p className="text-gray-700 font-medium">충전소를 선택하면 충전기 목록이 표시됩니다.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* 로그 */}
      <Card className="bg-white border-gray-300">
        <CardHeader className="py-3 bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-sm text-black">작업 로그</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="text-xs space-y-1 max-h-[15vh] overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-gray-800 font-medium py-1 border-b border-gray-100">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500 font-medium py-2">로그가 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
