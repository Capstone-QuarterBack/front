import type { Station } from "@/components/3d/StationVisualization";

// 충전소 목록 가져오기
export async function getStations(): Promise<Station[]> {
  try {
    // 실제 API 호출
    // const response = await fetch('/api/stations')
    // if (!response.ok) throw new Error('Failed to fetch stations')
    // return await response.json()

    // 목데이터 반환 (API 연동 전까지 사용)
    return [
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
    ];
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw error;
  }
}

// 충전소 상태 업데이트
export async function updateStationStatus(
  stationId: string,
  status: "active" | "disabled" | "maintenance"
): Promise<void> {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/stations/${stationId}/status`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ status }),
    // })
    // if (!response.ok) throw new Error('Failed to update station status')
    // return

    // 목데이터 사용 시 성공 시뮬레이션
    return Promise.resolve();
  } catch (error) {
    console.error("Error updating station status:", error);
    throw error;
  }
}

// 충전기 상태 업데이트
export async function updateChargerStatus(
  stationId: string,
  chargerId: string,
  status: "available" | "disabled" | "maintenance"
): Promise<void> {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/stations/${stationId}/chargers/${chargerId}/status`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ status }),
    // })
    // if (!response.ok) throw new Error('Failed to update charger status')
    // return

    // 목데이터 사용 시 성공 시뮬레이션
    return Promise.resolve();
  } catch (error) {
    console.error("Error updating charger status:", error);
    throw error;
  }
}

// 충전소 상세 정보 가져오기
export async function getStationDetails(stationId: string): Promise<Station> {
  try {
    // 실제 API 호출
    // const response = await fetch(`/api/stations/${stationId}`)
    // if (!response.ok) throw new Error('Failed to fetch station details')
    // return await response.json()

    // 목데이터 반환
    const stations = await getStations();
    const station = stations.find((s) => s.id === stationId);
    if (!station) throw new Error("Station not found");
    return station;
  } catch (error) {
    console.error("Error fetching station details:", error);
    throw error;
  }
}
