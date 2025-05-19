import type { Station, Charger } from "@/components/3d/StationVisualization"
import { API_BASE_URL } from "./apiConfig"
// API 응답 타입 정의
interface ApiCharger {
  evseId: number
  stationId: string
  status: string
}

interface ApiStation {
  stationName: string
  latitude: number
  longitude: number
  address: string
  stationId: string
  status: string
  chargers: ApiCharger[]
}

interface ApiResponse {
  stations: ApiStation[]
}

// 충전기 상태 업데이트 응답 타입
interface ChargerUpdateResponse {
  stationId: string
  evseId: number
}

// API에서 받은 데이터를 3D 시각화 컴포넌트에서 사용하는 형식으로 변환하는 함수
function mapApiDataToStations(apiData: ApiResponse): Station[] {
  return apiData.stations.map((apiStation, stationIndex) => {
    // 충전기 위치 계산 (4개 충전기를 기준으로 배치)
    const chargerPositions: [number, number, number][] = [
      [-0.7, 0, 0.7],
      [0.7, 0, 0.7],
      [-0.7, 0, -0.7],
      [0.7, 0, -0.7],
    ]

    // 충전소 위치 계산 (각 충전소를 적절히 분산 배치)
    const stationLocation: [number, number, number] = [stationIndex * 10 - (apiData.stations.length - 1) * 5, 0, 0]

    // 충전기 상태 매핑 (API 응답 -> 내부 상태)
    const statusMap: Record<string, "available" | "charging" | "disabled" | "maintenance"> = {
      AVAILABLE: "available", // 이용가능
      OCCUPIED: "charging", // 이용중
      UNAVAILABLE: "disabled", // 사용불가
    }

    // 충전소 상태 매핑
    const stationStatusMap: Record<string, "active" | "disabled" | "maintenance"> = {
      ACTIVE: "active",
      INACTIVE: "disabled",
      MAINTENANCE: "maintenance",
    }

    // 충전기 데이터 변환
    const chargers: Charger[] = apiStation.chargers.map((apiCharger, index) => {
      // 충전기 위치 (최대 4개까지 기본 위치 사용, 그 이상은 랜덤 배치)
      const position: [number, number, number] =
        index < 4 ? chargerPositions[index] : [(Math.random() - 0.5) * 1.4, 0, (Math.random() - 0.5) * 1.4]

      // 충전 중인지 확인 (OCCUPIED 상태인 경우)
      const isCharging = apiCharger.status === "OCCUPIED"

      return {
        id: `${apiStation.stationId}-${apiCharger.evseId}`,
        name: `충전기 ${apiCharger.evseId}`,
        position,
        status: statusMap[apiCharger.status] || "disabled",
        currentCar: isCharging ? `car-${apiStation.stationId}-${apiCharger.evseId}` : null,
        power: 50 + (index % 2) * 50, // 50kW 또는 100kW
        connectorType: index % 3 === 0 ? "CCS" : index % 3 === 1 ? "CHAdeMO" : "Type2",
      }
    })

    // 충전 중인 충전기 수 계산
    const chargingCars = chargers.filter((c) => c.status === "charging").length

    return {
      id: apiStation.stationId,
      name: apiStation.stationName,
      location: stationLocation,
      status: stationStatusMap[apiStation.status] || "disabled",
      chargingCars,
      maxCapacity: chargers.length,
      chargers,
    }
  })
}

// 모델링 API에서 충전소 정보 가져오기
export async function getModelingStations(): Promise<Station[]> {
  try {
    // const response = await fetch(`${API_BASE_URL}/api/modeling/stations-info`)
    const response = await fetch(`${API_BASE_URL}/modeling/stations-info`)

    if (!response.ok) {
      throw new Error(`Failed to fetch modeling stations: ${response.status}`)
    }

    const data: ApiResponse = await response.json()
    return mapApiDataToStations(data)
  } catch (error) {
    console.error("Error fetching modeling stations:", error)
    throw error
  }
}

// 충전소 상태 업데이트 (새로운 API 엔드포인트 사용)
export async function updateModelingStationStatus(stationId: string, status: string): Promise<string> {
  try {
    // 새로운 API 엔드포인트 형식 사용
    const response = await fetch(`${API_BASE_URL}/modeling/stations/${stationId}/${status}`, {
      method: "PUT",
      headers: {
        accept: "*/*",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to update station status: ${response.status}`)
    }

    // 응답은 stationId 문자열
    const responseText = await response.text()
    return responseText
  } catch (error) {
    console.error("Error updating station status:", error)
    throw error
  }
}

// 충전기 상태 업데이트 (새로운 API 엔드포인트 사용)
export async function updateModelingChargerStatus(
  stationId: string,
  chargerId: string,
  status: string,
): Promise<ChargerUpdateResponse> {
  // chargerId에서 evseId 추출 (예: "station-001-1" -> 1)
  const evseId = Number.parseInt(chargerId.split("-").pop() || "0")

  // 내부 상태를 API 상태로 변환
  const apiStatusMap: Record<string, string> = {
    available: "AVAILABLE",
    charging: "OCCUPIED",
    disabled: "UNAVAILABLE",
  }

  const apiStatus = apiStatusMap[status] || "UNAVAILABLE"

  try {
    // 새로운 API 엔드포인트 형식 사용
    const response = await fetch(
      `${API_BASE_URL}/modeling/stations/${stationId}/chargers/${evseId}/${apiStatus}`,
      {
        method: "PUT",
        headers: {
          accept: "*/*",
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to update charger status: ${response.status}`)
    }

    // 응답은 { stationId, evseId } 객체
    const data: ChargerUpdateResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error updating charger status:", error)
    throw error
  }
}
