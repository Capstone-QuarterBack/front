import type { ChargerStatusInfo, ChargerInfoResponse } from "@/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// 충전소의 충전기 ID 목록 가져오기
export async function fetchChargerStatuses(stationId: string): Promise<ChargerStatusInfo[]> {
  try {
    console.log(`충전소 ${stationId}의 충전기 상태 정보 요청`)

    // API 엔드포인트 구성
    const url = `${API_BASE_URL}/monitoring/evse-ids/${stationId}`
    console.log(`API 요청 URL: ${url}`)

    // 실제 API 호출
    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 요청 실패: ${response.status}, ${errorText}`)
    }
    return await response.json()

    // 모의 데이터 반환 부분은 주석 처리 또는 삭제
    // return [
    //   { evseId: 1, chargerStatus: "AVAILABLE" },
    //   { evseId: 2, chargerStatus: "UNAVAILABLE" },
    //   { evseId: 3, chargerStatus: "AVAILABLE" },
    //   { evseId: 4, chargerStatus: "UNAVAILABLE" },
    // ]
  } catch (error) {
    console.error("충전기 상태 정보 가져오기 실패:", error)
    throw error
  }
}

// 충전기 정보 가져오기 (available/unavailable 공통 함수)
export async function fetchChargerInfo(
  stationId: string,
  evseId: number,
  status: "available" | "unavailable",
  page = 0,
  size = 10,
): Promise<ChargerInfoResponse> {
  try {
    console.log(`충전기 ${evseId}의 ${status} 정보 요청 (페이지: ${page}, 크기: ${size})`)

    // API 엔드포인트 구성
    const url = `${API_BASE_URL}/monitoring/charger-info/${stationId}/${status}/${evseId}?page=${page}&size=${size}`
    console.log(`API 요청 URL: ${url}`)

    // 실제 API 호출
    try {
      const response = await fetch(url)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API 요청 실패: ${response.status}, ${errorText}`)
      }
      const data = await response.json()
      console.log(`API 응답 데이터:`, data)
      return data
    } catch (fetchError) {
      console.error(`API 호출 중 오류 발생:`, fetchError)
      throw fetchError
    }

    // 모의 데이터 반환 부분은 주석 처리 또는 삭제
    // const mockData: Record<string, ChargerInfoResponse> = {
    //   // 사용 가능한 충전기 (evseId 1)
    //   "1-available": {
    //     usages: [
    //       {
    //         chargeStartTime: "2025-05-05T18:28:07",
    //         chargeEndTime: "2025-05-05T19:28:07",
    //         chargedEnergy: 10,
    //         price: 5000,
    //         carNumber: "12가3456",
    //         chargerModel: "충전기-A",
    //         approvalNumber: "user-001",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-05-05T16:28:07",
    //         chargeEndTime: "2025-05-05T17:28:07",
    //         chargedEnergy: 8,
    //         price: 4000,
    //         carNumber: "34나5678",
    //         chargerModel: "충전기-A",
    //         approvalNumber: "user-002",
    //         errorCode: "00",
    //       },
    //     ],
    //     currentPage: 0,
    //     totalPages: 1,
    //     totalElements: 2,
    //   },
    //   // 사용 불가능한 충전기 (evseId 2)
    //   "2-unavailable": {
    //     usages: [
    //       {
    //         chargeStartTime: "2025-05-05T09:16:55",
    //         chargeEndTime: "2025-05-05T10:16:55",
    //         chargedEnergy: 12,
    //         price: 6000,
    //         carNumber: "56다7890",
    //         chargerModel: "station-002",
    //         approvalNumber: "user-003",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-05-05T07:16:55",
    //         chargeEndTime: "2025-05-05T08:16:55",
    //         chargedEnergy: 15,
    //         price: 7500,
    //         carNumber: "78라1234",
    //         chargerModel: "station-002",
    //         approvalNumber: "user-004",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-05-04T14:28:07",
    //         chargeEndTime: "2025-05-04T15:28:07",
    //         chargedEnergy: 12,
    //         price: 6000,
    //         carNumber: "56다7890",
    //         chargerModel: "station-002",
    //         approvalNumber: "user-003",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-05-04T12:28:07",
    //         chargeEndTime: "2025-05-04T13:28:07",
    //         chargedEnergy: 100,
    //         price: 7500,
    //         carNumber: "78라1234",
    //         chargerModel: "station-002",
    //         approvalNumber: "user-004",
    //         errorCode: "00",
    //       },
    //     ],
    //     currentPage: 0,
    //     totalPages: 1,
    //     totalElements: 4,
    //   },
    //   // 사용 가능한 충전기 (evseId 3)
    //   "3-available": {
    //     usages: [
    //       {
    //         chargeStartTime: "2025-05-01T10:32:00",
    //         chargeEndTime: "2025-05-01T11:15:30",
    //         chargedEnergy: 45,
    //         price: 22500,
    //         carNumber: "90마1234",
    //         chargerModel: "충전기-C",
    //         approvalNumber: "user-005",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-04-30T16:20:15",
    //         chargeEndTime: "2025-04-30T17:05:40",
    //         chargedEnergy: 38,
    //         price: 19000,
    //         carNumber: "12바3456",
    //         chargerModel: "충전기-C",
    //         approvalNumber: "user-006",
    //         errorCode: "00",
    //       },
    //     ],
    //     currentPage: 0,
    //     totalPages: 1,
    //     totalElements: 2,
    //   },
    //   // 사용 불가능한 충전기 (evseId 4)
    //   "4-unavailable": {
    //     usages: [
    //       {
    //         chargeStartTime: "2025-05-05T11:30:00",
    //         chargeEndTime: "2025-05-05T12:45:20",
    //         chargedEnergy: 20,
    //         price: 10000,
    //         carNumber: "34사5678",
    //         chargerModel: "station-004",
    //         approvalNumber: "user-007",
    //         errorCode: "00",
    //       },
    //       {
    //         chargeStartTime: "2025-05-05T08:15:30",
    //         chargeEndTime: "2025-05-05T09:30:45",
    //         chargedEnergy: 18,
    //         price: 9000,
    //         carNumber: "56아7890",
    //         chargerModel: "station-004",
    //         approvalNumber: "user-008",
    //         errorCode: "00",
    //       },
    //     ],
    //     currentPage: 0,
    //     totalPages: 1,
    //     totalElements: 2,
    //   },
    // }

    // 해당 충전기 ID와 상태의 모의 데이터가 있으면 반환, 없으면 기본 모의 데이터 반환
    // const key = `${evseId}-${status}`
    // return (
    //   mockData[key] || {
    //     usages: [
    //       {
    //         chargeStartTime: "2025-05-04T18:28:07",
    //         chargeEndTime: "2025-05-04T19:28:07",
    //         chargedEnergy: 10,
    //         price: 5000,
    //         carNumber: "기본-1234",
    //         chargerModel: "기본충전기",
    //         approvalNumber: "user-000",
    //         errorCode: "00",
    //       },
    //     ],
    //     currentPage: 0,
    //     totalPages: 1,
    //     totalElements: 1,
    //   }
    // )
  } catch (error) {
    console.error(`충전기 ${evseId}의 ${status} 정보 가져오기 실패:`, error)
    throw error
  }
}
