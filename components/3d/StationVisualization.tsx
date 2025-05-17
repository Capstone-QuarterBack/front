"use client";

import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { ChargingStation } from "./ChargingStation";
import { ElectricCar } from "./ElectricCar";
import { StationControlPanel } from "./StationControlPanel";
import {
  getStations,
  updateStationStatus,
  updateChargerStatus,
} from "@/services/stationControlApi";

// 충전기 타입 정의
export interface Charger {
  id: string;
  name: string;
  position: [number, number, number]; // 튜플 타입으로 변경
  status: "available" | "charging" | "disabled" | "maintenance";
  currentCar: string | null; // 현재 충전 중인 차량 ID
  power: number; // kW
  connectorType: string; // e.g., "CCS", "CHAdeMO", "Type2"
}

// 충전소 타입 정의
export interface Station {
  id: string;
  name: string;
  location: [number, number, number]; // 튜플 타입으로 변경
  status: "active" | "disabled" | "maintenance";
  chargingCars: number;
  maxCapacity: number;
  chargers: Charger[]; // 충전기 배열 추가
}

// 바닥 컴포넌트
function GrassFloor() {
  const texture = useTexture("/images/grass-texture.png");

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export function StationVisualization() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);

  // 충전소 데이터 로드
  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        const data = await getStations();
        setStations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load stations:", err);
        setError("충전소 데이터를 불러오는데 실패했습니다.");
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // 충전소 상태 변경 핸들러
  const handleToggleStationStatus = async (stationId: string) => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;

    const newStatus = station.status === "active" ? "disabled" : "active";

    try {
      await updateStationStatus(stationId, newStatus);

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
                        : (c.status as
                            | "available"
                            | "charging"
                            | "disabled"
                            | "maintenance"),
                  }))
                : s.chargers;

            return {
              ...s,
              status: newStatus,
              chargers: updatedChargers,
            } as Station;
          }
          return s;
        });
      });

      // 선택된 충전소가 변경된 충전소인 경우 선택된 충전소도 업데이트
      if (selectedStation && selectedStation.id === stationId) {
        const updatedStation = stations.find((s) => s.id === stationId);
        if (updatedStation) {
          setSelectedStation({ ...updatedStation, status: newStatus });
        }
      }

      // 선택된 충전기가 변경된 충전소에 속한 경우 선택 해제
      if (selectedCharger && selectedCharger.id.startsWith(stationId)) {
        setSelectedCharger(null);
      }
    } catch (err) {
      console.error("Failed to update station status:", err);
      alert("충전소 상태 변경에 실패했습니다.");
    }
  };

  // 충전기 상태 변경 핸들러
  const handleToggleChargerStatus = async (
    stationId: string,
    chargerId: string
  ) => {
    const station = stations.find((s) => s.id === stationId);
    if (!station) return;

    const charger = station.chargers.find((c) => c.id === chargerId);
    if (!charger) return;

    // 충전 중인 충전기는 disabled로, disabled 충전기는 available로 변경
    const newStatus =
      charger.status === "charging" || charger.status === "available"
        ? ("disabled" as const)
        : ("available" as const);

    try {
      await updateChargerStatus(stationId, chargerId, newStatus);

      // 상태 업데이트
      setStations((prevStations) => {
        return prevStations.map((s) => {
          if (s.id === stationId) {
            const updatedChargers = s.chargers.map((c) => {
              if (c.id === chargerId) {
                return { ...c, status: newStatus } as Charger;
              }
              return c;
            });

            // 충전 중인 차량 수 업데이트
            const chargingCount = updatedChargers.filter(
              (c) => c.status === "charging"
            ).length;

            return {
              ...s,
              chargers: updatedChargers,
              chargingCars: chargingCount,
            } as Station;
          }
          return s;
        });
      });

      // 선택된 충전소가 변경된 충전소인 경우 선택된 충전소도 업데이트
      if (selectedStation && selectedStation.id === stationId) {
        const updatedStation = stations.find((s) => s.id === stationId);
        if (updatedStation) {
          const updatedChargers = updatedStation.chargers.map((c) => {
            if (c.id === chargerId) {
              return { ...c, status: newStatus } as Charger;
            }
            return c;
          });
          setSelectedStation({
            ...updatedStation,
            chargers: updatedChargers,
          } as Station);
        }
      }

      // 선택된 충전기가 변경된 충전기인 경우 선택된 충전기도 업데이트
      if (selectedCharger && selectedCharger.id === chargerId) {
        setSelectedCharger({
          ...selectedCharger,
          status: newStatus,
        } as Charger);
      }
    } catch (err) {
      console.error("Failed to update charger status:", err);
      alert("충전기 상태 변경에 실패했습니다.");
    }
  };

  // 충전기 선택 핸들러
  const handleSelectCharger = (station: Station, charger: Charger) => {
    setSelectedStation(station);
    setSelectedCharger(charger);
  };

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
                    setSelectedStation(station);
                    setSelectedCharger(null);
                  }}
                  onChargerClick={(charger) =>
                    handleSelectCharger(station, charger)
                  }
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
                      rotation={[
                        0,
                        Math.PI * (charger.position[0] > 0 ? 0.5 : -0.5),
                        0,
                      ]}
                      isCharging={
                        charger.status === "charging" &&
                        station.status === "active"
                      }
                    />
                  ))}
              </group>
            ))}

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
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
            setSelectedStation(station);
            setSelectedCharger(null);
          }}
          onSelectCharger={handleSelectCharger}
          onToggleStationStatus={handleToggleStationStatus}
          onToggleChargerStatus={handleToggleChargerStatus}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
