import type { ChargerStatusInfo, AvailableChargerResponse } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// 충전소의 충전기 상태 정보 가져오기
export async function fetchChargerStatuses(stationId: string): Promise<ChargerStatusInfo[]> {
  try {
    console.log(`충전소 ${stationId}의 충전기 상태 정보 요청`)

    // 실제 API 호출 (현재는 모의 데이터 반환)
    // const response = await fetch(`${API_BASE_URL}/monitoring/station/${stationId}/chargers`);
    // if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    // return await response.json();

    // 모의 데이터 반환 (실제 API 연동 시 위 코드 사용)
    return [
      { evseId: 1, chargerStatus: "AVAILABLE" },
      { evseId: 2, chargerStatus: "AVAILABLE" },
      { evseId: 3, chargerStatus: "AVAILABLE" },
    ]
  } catch (error) {
    console.error("충전기 상태 정보 가져오기 실패:", error)
    throw error
  }
}

// 사용 가능한 충전기 정보 가져오기
export async function fetchAvailableChargerInfo(
  evseId: number,
  page = 0,
  size = 10,
): Promise<AvailableChargerResponse> {
  try {
    console.log(`충전기 ${evseId}의 사용 가능 정보 요청 (페이지: ${page}, 크기: ${size})`)

    // 실제 API 호출
    // const response = await fetch(
    //   `${API_BASE_URL}/monitoring/charger-info/available/${evseId}?page=${page}&size=${size}`,
    // )
    // if (!response.ok) {
    //   throw new Error(`API 요청 실패: ${response.status}`)
    // }
    // return await response.json()

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    // 각 충전기 ID에 따라 다른 모의 데이터 반환
    const mockData: Record<number, AvailableChargerResponse> = {
      1: {
        totalChargedEnergy: 15000,
        totalVehicleCount: 120,
        totalRevenue: 750000,
        chargedEnergyDiffPercent: 5,
        vehicleCountDiffPercent: 8,
        revenueDiffPercent: 7,
        usages: [
          {
            chargeStartTime: "2025-05-04T18:28:07",
            chargeEndTime: "2025-05-04T19:28:07",
            chargedEnergy: 10,
            price: 5000,
            carNumber: "12가3456",
            chargerModel: "충전기-A",
            approvalNumber: "user-001",
            errorCode: "00",
          },
          {
            chargeStartTime: "2025-05-04T16:28:07",
            chargeEndTime: "2025-05-04T17:28:07",
            chargedEnergy: 8,
            price: 4000,
            carNumber: "34나5678",
            chargerModel: "충전기-A",
            approvalNumber: "user-002",
            errorCode: "00",
          },
        ],
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
      },
      2: {
        totalChargedEnergy: 22000,
        totalVehicleCount: 180,
        totalRevenue: 1100000,
        chargedEnergyDiffPercent: -3,
        vehicleCountDiffPercent: 2,
        revenueDiffPercent: -1,
        usages: [
          {
            chargeStartTime: "2025-05-03T14:15:30",
            chargeEndTime: "2025-05-03T15:20:45",
            chargedEnergy: 15,
            price: 7500,
            carNumber: "56다7890",
            chargerModel: "충전기-B",
            approvalNumber: "user-003",
            errorCode: "00",
          },
          {
            chargeStartTime: "2025-05-02T09:45:12",
            chargeEndTime: "2025-05-02T10:30:22",
            chargedEnergy: 12,
            price: 6000,
            carNumber: "78라9012",
            chargerModel: "충전기-B",
            approvalNumber: "user-004",
            errorCode: "00",
          },
        ],
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
      },
      3: {
        totalChargedEnergy: 18500,
        totalVehicleCount: 150,
        totalRevenue: 925000,
        chargedEnergyDiffPercent: 10,
        vehicleCountDiffPercent: 5,
        revenueDiffPercent: 12,
        usages: [
          {
            chargeStartTime: "2025-05-01T10:32:00",
            chargeEndTime: "2025-05-01T11:15:30",
            chargedEnergy: 45,
            price: 22500,
            carNumber: "90마1234",
            chargerModel: "충전기-C",
            approvalNumber: "user-005",
            errorCode: "00",
          },
          {
            chargeStartTime: "2025-04-30T16:20:15",
            chargeEndTime: "2025-04-30T17:05:40",
            chargedEnergy: 38,
            price: 19000,
            carNumber: "12바3456",
            chargerModel: "충전기-C",
            approvalNumber: "user-006",
            errorCode: "00",
          },
        ],
        currentPage: 0,
        totalPages: 1,
        totalElements: 2,
      },
    }

    // 해당 충전기 ID의 모의 데이터가 있으면 반환, 없으면 기본 모의 데이터 반환
    return (
      mockData[evseId] || {
        totalChargedEnergy: 10000,
        totalVehicleCount: 100,
        totalRevenue: 500000,
        chargedEnergyDiffPercent: 0,
        vehicleCountDiffPercent: 0,
        revenueDiffPercent: 0,
        usages: [
          {
            chargeStartTime: "2025-05-04T18:28:07",
            chargeEndTime: "2025-05-04T19:28:07",
            chargedEnergy: 10,
            price: 5000,
            carNumber: "기본-1234",
            chargerModel: "기본충전기",
            approvalNumber: "user-000",
            errorCode: "00",
          },
        ],
        currentPage: 0,
        totalPages: 1,
        totalElements: 1,
      }
    )
  } catch (error) {
    console.error(`충전기 ${evseId}의 사용 가능 정보 가져오기 실패:`, error)
    throw error
  }
}

// 사용 중인 충전기 정보 가져오기 (필요시 구현)
export async function fetchInUseChargerInfo(evseId: number) {
  try {
    console.log(`충전기 ${evseId}의 사용 중 정보 요청`)

    // 실제 API 호출 (API 엔드포인트가 제공되면 구현)
    // const response = await fetch(`${API_BASE_URL}/monitoring/charger-info/in-use/${evseId}`);
    // if (!response.ok) throw new Error(`API 요청 실패: ${response.status}`);
    // return await response.json();

    // 모의 데이터 반환 (실제 API 연동 시 위 코드 사용)
    return {
      // 사용 중인 충전기 정보에 대한 모의 데이터
    }
  } catch (error) {
    console.error(`충전기 ${evseId}의 사용 중 정보 가져오기 실패:`, error)
    throw error
  }
}
