"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, useTexture } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { ChargingStation } from "./ChargingStation"
import { ElectricCar } from "./ElectricCar"
import { StationControlPanel } from "./StationControlPanel"
import { getModelingStations, updateModelingStationStatus, updateModelingChargerStatus } from "@/services/modelingApi"
import { toast } from "@/components/ui/use-toast"

// 충전기 타입 정의
export interface Charger {
  id: string
  name: string
  position: [number, number, number] // 튜플 타입으로 변경
  status: "available" | "charging" | "disabled" | "maintenance"
  currentCar: string | null // 현재 충전 중인 차량 ID
  power: number // kW
  connectorType: string // e.g., "CCS", "CHAdeMO", "Type2"
}

// 충전소 타입 정의
export interface Station {
  id: string
  name: string
  location: [number, number, number] // 튜플 타입으로 변경
  status: "active" | "disabled" | "maintenance"
  chargingCars: number
  maxCapacity: number
  chargers: Charger[] // 충전기 배열 추가
}

// 바닥 컴포넌트
function GrassFloor() {
  const texture = useTexture("/images/grass-texture.png")

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

export function StationVisualization() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)

  // 충전소 데이터 로드
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true)
        const data = await getModelingStations()
        setStations(data)
        setError(null)

        // 데이터 로드 후 비활성화된 충전소의 충전기들을 모두 비활성화 처리
        const disabledStations = data.filter((station) => station.status === "disabled")
        if (disabledStations.length > 0) {
          console.log(`${disabledStations.length}개의 비활성화된 충전소의 충전기를 비활성화합니다.`)

          // 각 비활성화된 충전소에 대해 모든 충전기 비활성화 API 호출
          for (const station of disabledStations) {
            console.log(`충전소 ${station.name}(${station.id})의 충전기를 비활성화합니다.`)

            // 각 충전기에 대해 비활성화 API 호출
            for (const charger of station.chargers) {
              if (charger.status !== "disabled") {
                try {
                  // UNAVAILABLE 상태로 API 호출
                  await updateModelingChargerStatus(station.id, charger.id, "UNAVAILABLE")
                  console.log(`충전기 ${charger.id} 비활성화 완료`)
                } catch (error) {
                  console.error(`충전기 ${charger.id} 비활성화 실패:`, error)
                }
              }
            }
          }

          // 상태 업데이트 - 비활성화된 충전소의 모든 충전기 상태를 disabled로 설정
          setStations((prevStations) => {
            return prevStations.map((station) => {
              if (station.status === "disabled") {
                const updatedChargers = station.chargers.map((charger) => ({
                  ...charger,
                  status: "disabled" as const,
                  currentCar: null,
                }))

                return {
                  ...station,
                  chargers: updatedChargers,
                  chargingCars: 0,
                }
              }
              return station
            })
          })
        }
      } catch (err) {
        console.error("Failed to load stations:", err)
        setError("충전소 데이터를 불러오는데 실패했습니다.")
        // 목데이터 사용
        setStations([
          {
            id: "1",
            name: "서울역 충전소",
            location: [0, 0, 0], // 튜플 형태로 변경
            status: "active",
            chargingCars: 2,
            maxCapacity: 4,
            chargers: [
              {
                id: "1-1",
                name: "충전기 1",
                position: [-0.7, 0, 0.7], // 튜플 형태로 변경
                status: "charging",
                currentCar: "car-1",
                power: 50,
                connectorType: "CCS",
              },
              {
                id: "1-2",
                name: "충전기 2",
                position: [0.7, 0, 0.7], // 튜플 형태로 변경
                status: "available",
                currentCar: null,
                power: 100,
                connectorType: "CHAdeMO",
              },
              {
                id: "1-3",
                name: "충전기 3",
                position: [-0.7, 0, -0.7], // 튜플 형태로 변경
                status: "available",
                currentCar: null,
                power: 50,
                connectorType: "Type2",
              },
              {
                id: "1-4",
                name: "충전기 4",
                position: [0.7, 0, -0.7], // 튜플 형태로 변경
                status: "charging",
                currentCar: "car-2",
                power: 100,
                connectorType: "CCS",
              },
            ],
          },
          {
            id: "2",
            name: "강남 충전소",
            location: [5, 0, 5], // 튜플 형태로 변경
            status: "active",
            chargingCars: 1,
            maxCapacity: 3,
            chargers: [
              {
                id: "2-1",
                name: "충전기 1",
                position: [-0.7, 0, 0.7], // 튜플 형태로 변경
                status: "charging",
                currentCar: "car-3",
                power: 50,
                connectorType: "CCS",
              },
              {
                id: "2-2",
                name: "충전기 2",
                position: [0.7, 0, 0.7], // 튜플 형태로 변경
                status: "available",
                currentCar: null,
                power: 100,
                connectorType: "CHAdeMO",
              },
              {
                id: "2-3",
                name: "충전기 3",
                position: [0, 0, -0.7], // 튜플 형태로 변경
                status: "maintenance",
                currentCar: null,
                power: 50,
                connectorType: "Type2",
              },
            ],
          },
          {
            id: "3",
            name: "인천 충전소",
            location: [-5, 0, -5], // 튜플 형태로 변경
            status: "active",
            chargingCars: 0,
            maxCapacity: 2,
            chargers: [
              {
                id: "3-1",
                name: "충전기 1",
                position: [-0.5, 0, 0], // 튜플 형태로 변경
                status: "available",
                currentCar: null,
                power: 50,
                connectorType: "CCS",
              },
              {
                id: "3-2",
                name: "충전기 2",
                position: [0.5, 0, 0], // 튜플 형태로 변경
                status: "available",
                currentCar: null,
                power: 100,
                connectorType: "CHAdeMO",
              },
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadStations()
  }, [])

  // 충전소 상태 변경 핸들러
  const handleToggleStationStatus = async (stationId: string) => {
    const station = stations.find((s) => s.id === stationId)
    if (!station) return

    const newStatus = station.status === "active" ? "disabled" : "active"
    // API에 맞게 상태값 변환
    const apiStatus = newStatus === "active" ? "ACTIVE" : "INACTIVE"

    try {
      // 새로운 API 호출 및 응답 처리
      const responseStationId = await updateModelingStationStatus(stationId, apiStatus)
      console.log(`Station ${responseStationId} status updated to ${apiStatus}`)
      toast({
        title: "충전소 상태 변경 성공",
        description: `${station.name} 충전소가 ${newStatus === "active" ? "활성화" : "비활성화"}되었습니다.`,
      })

      // 상태 업데이트
      setStations((prevStations) => {
        return prevStations.map((s) => {
          if (s.id === stationId) {
            // 충전소 상태가 disabled로 변경되면 모든 충전기도 disabled로 변경
            const updatedChargers =
              newStatus === "disabled"
                ? s.chargers.map((c) => ({
                    ...c,
                    status:
                      c.status === "charging"
                        ? ("disabled" as const)
                        : (c.status as "available" | "charging" | "disabled" | "maintenance"),
                    currentCar: null, // 충전소가 비활성화되면 모든 차량 제거
                  }))
                : s.chargers

            return {
              ...s,
              status: newStatus,
              chargers: updatedChargers,
              chargingCars: 0, // 충전소가 비활성화되면 충전 중인 차량 수 0으로 설정
            } as Station
          }
          return s
        })
      })

      // 선택된 충전소가 변경된 충전소인 경우 선택된 충전소도 업데이트
      if (selectedStation && selectedStation.id === stationId) {
        const updatedStation = stations.find((s) => s.id === stationId)
        if (updatedStation) {
          setSelectedStation({ ...updatedStation, status: newStatus })
        }
      }

      // 선택된 충전기가 변경된 충전소에 속한 경우 선택 해제
      if (selectedCharger && selectedCharger.id.startsWith(stationId)) {
        setSelectedCharger(null)
      }
    } catch (err) {
      console.error("Failed to update station status:", err)
      toast({
        title: "충전소 상태 변경 실패",
        description: "충전소 상태를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 충전기 상태 변경 핸들러
  const handleToggleChargerStatus = async (stationId: string, chargerId: string) => {
    const station = stations.find((s) => s.id === stationId)
    if (!station) return

    // 충전소가 비활성화 상태인 경우 작업 중단
    if (station.status === "disabled") {
      console.log(`충전소 ${station.name}(${station.id})가 비활성화 상태입니다. 충전기 상태를 변경할 수 없습니다.`)
      toast({
        title: "작업 불가",
        description: "비활성화된 충전소의 충전기 상태는 변경할 수 없습니다.",
        variant: "destructive",
      })
      return
    }

    const charger = station.chargers.find((c) => c.id === chargerId)
    if (!charger) return

    // 새로운 상태 및 API 요청 상태 결정
    let newStatus: "available" | "charging" | "disabled" | "maintenance"
    let apiStatus: string

    // 1. 충전중 -> 정지 명령 -> 충전 종료 및 사용가능으로 변경
    if (charger.status === "charging") {
      apiStatus = "UNAVAILABLE" // API에 UNAVAILABLE 전송
      newStatus = "available" // 프론트에서는 사용가능으로 표시
    }
    // 2. 사용 가능 -> 비활성화 명령 -> 충전기가 비활성화로 변경
    else if (charger.status === "available") {
      apiStatus = "UNAVAILABLE" // API에 UNAVAILABLE 전송
      newStatus = "disabled" // 프론트에서는 사용불가로 표시
    }
    // 3. 사용 불가능 -> 활성화 명령 -> 충전기가 사용 가능으로 변경
    else {
      apiStatus = "AVAILABLE" // API에 AVAILABLE 전송
      newStatus = "available" // 프론트에서는 사용가능으로 표시
    }

    try {
      // 새로운 API 호출 및 응답 처리 - 실제 API에 맞게 상태값 전달
      console.log(`충전기 상태 변경 시도: ${charger.status} -> ${newStatus} (API: ${apiStatus})`)
      const response = await updateModelingChargerStatus(stationId, chargerId, apiStatus)
      console.log(
        `Charger ${response.evseId} in station ${response.stationId} status updated to ${apiStatus} (frontend: ${newStatus})`,
      )

      // 성공 메시지 표시
      let actionMessage = ""
      if (charger.status === "charging") {
        actionMessage = "충전이 정지되었습니다"
      } else if (charger.status === "available") {
        actionMessage = "비활성화되었습니다"
      } else {
        actionMessage = "활성화되었습니다"
      }

      toast({
        title: "충전기 상태 변경 성공",
        description: `${station.name}의 ${charger.name}가 ${actionMessage}`,
      })

      // 상태 업데이트
      setStations((prevStations) => {
        return prevStations.map((s) => {
          if (s.id === stationId) {
            const updatedChargers = s.chargers.map((c) => {
              if (c.id === chargerId) {
                // 항상 null로 설정 (충전 중 상태는 이제 없음)
                const currentCar = null
                return { ...c, status: newStatus, currentCar } as Charger
              }
              return c
            })

            // 충전 중인 차량 수 업데이트
            const chargingCount = updatedChargers.filter((c) => c.status === "charging").length

            return {
              ...s,
              chargers: updatedChargers,
              chargingCars: chargingCount,
            } as Station
          }
          return s
        })
      })

      // 선택된 충전소가 변경된 충전소인 경우 선택된 충전소도 업데이트
      if (selectedStation && selectedStation.id === stationId) {
        const updatedStation = stations.find((s) => s.id === stationId)
        if (updatedStation) {
          const updatedChargers = updatedStation.chargers.map((c) => {
            if (c.id === chargerId) {
              // 항상 null로 설정 (충전 중 상태는 이제 없음)
              const currentCar = null
              return { ...c, status: newStatus, currentCar } as Charger
            }
            return c
          })

          const chargingCount = updatedChargers.filter((c) => c.status === "charging").length

          setSelectedStation({
            ...updatedStation,
            chargers: updatedChargers,
            chargingCars: chargingCount,
          } as Station)
        }
      }

      // 선택된 충전기가 변경된 충전기인 경우 선택된 충전기도 업데이트
      if (selectedCharger && selectedCharger.id === chargerId) {
        // 항상 null로 설정 (충전 중 상태는 이제 없음)
        const currentCar = null
        setSelectedCharger({ ...selectedCharger, status: newStatus, currentCar } as Charger)
      }
    } catch (err) {
      console.error("Failed to update charger status:", err)
      toast({
        title: "충전기 상태 변경 실패",
        description: "충전기 상태를 변경하는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  // 충전기 선택 핸들러
  const handleSelectCharger = (station: Station, charger: Charger) => {
    setSelectedStation(station)
    setSelectedCharger(charger)
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* 3D 시각화 영역 */}
      <div className="w-full md:w-3/4 h-[60vh] md:h-screen">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Environment preset="park" />
            <ambientLight intensity={0.7} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            {/* 잔디 바닥 */}
            <GrassFloor />

            {/* 충전소 및 충전기, 차량 렌더링 */}
            {stations.map((station) => (
              <group key={station.id}>
                <ChargingStation
                  position={station.location}
                  status={station.status}
                  chargers={station.chargers}
                  onClick={() => {
                    setSelectedStation(station)
                    setSelectedCharger(null)
                  }}
                  onChargerClick={(charger) => handleSelectCharger(station, charger)}
                  isSelected={selectedStation?.id === station.id}
                  selectedChargerId={selectedCharger?.id}
                />

                {/* 충전 중인 차량 렌더링 */}
                {station.chargers
                  .filter((charger) => charger.status === "charging")
                  .map((charger, index) => (
                    <ElectricCar
                      key={`${station.id}-car-${index}`}
                      position={
                        [
                          station.location[0] + charger.position[0] * 2,
                          0,
                          station.location[2] + charger.position[2] * 2,
                        ] as [number, number, number]
                      }
                      rotation={[0, Math.PI * (charger.position[0] > 0 ? 0.5 : -0.5), 0]}
                      isCharging={charger.status === "charging" && station.status === "active"}
                    />
                  ))}
              </group>
            ))}

            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Suspense>
        </Canvas>
      </div>

      {/* 제어 패널 */}
      <div className="w-full md:w-1/4 h-[40vh] md:h-screen overflow-y-auto bg-gray-100 p-4">
        <StationControlPanel
          stations={stations}
          selectedStation={selectedStation}
          selectedCharger={selectedCharger}
          onSelectStation={(station) => {
            setSelectedStation(station)
            setSelectedCharger(null)
          }}
          onSelectCharger={handleSelectCharger}
          onToggleStationStatus={handleToggleStationStatus}
          onToggleChargerStatus={handleToggleChargerStatus}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  )
}
