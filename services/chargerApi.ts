import type { ChargerStatusInfo, ChargerInfoResponse, CongestionData, ChargingHistoryResponse } from "@/types/api"
import { API_BASE_URL } from "./apiConfig"

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
  } catch (error) {
    console.error("충전기 상태 정보 가져오기 실패:", error)
    throw error
  }
}

// 충전기 정보 가져오기 (available/occupied/unavailable 공통 함수)
export async function fetchChargerInfo(
  stationId: string,
  evseId: number,
  status: "available" | "occupied" | "unavailable",
  page = 0,
  size = 10,
): Promise<ChargerInfoResponse> {
  try {
    console.log(`충전기 ${evseId}의 ${status} 정보 요청 (페이지: ${page}, 크기: ${size})`)

    // 중요: occupied 상태일 경우 API 요청에서는 unavailable로 변경
    const apiStatus = status === "occupied" ? "unavailable" : status

    // API 엔드포인트 구성
    const url = `${API_BASE_URL}/monitoring/charger-info/${stationId}/${apiStatus}/${evseId}?page=${page}&size=${size}`
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
  } catch (error) {
    console.error(`충전기 ${evseId}의 ${status} 정보 가져오기 실패:`, error)
    throw error
  }
}

// 충전 시간대 정보(혼잡도) 가져오기
export async function fetchCongestionData(stationId: string): Promise<CongestionData[]> {
  try {
    console.log(`충전소 ${stationId}의 충전 시간대 정보 요청`)

    // API 엔드포인트 구성
    const url = `${API_BASE_URL}/monitoring/congestion/${stationId}`
    console.log(`API 요청 URL: ${url}`)

    // 실제 API 호출
    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 요청 실패: ${response.status}, ${errorText}`)
    }
    const data = await response.json()
    console.log(`충전 시간대 정보 응답 데이터:`, data)
    return data
  } catch (error) {
    console.error("충전 시간대 정보 가져오기 실패:", error)

    // 모의 데이터 반환
    console.log("오류 발생으로 모의 데이터 반환")
    return [
      { hour: 0, count: 0, isPeak: false },
      { hour: 1, count: 0, isPeak: false },
      { hour: 2, count: 0, isPeak: false },
      { hour: 3, count: 0, isPeak: false },
      { hour: 4, count: 0, isPeak: false },
      { hour: 5, count: 2, isPeak: false },
      { hour: 6, count: 3, isPeak: false },
      { hour: 7, count: 1, isPeak: true },
      { hour: 8, count: 0, isPeak: false },
      { hour: 9, count: 1, isPeak: true },
      { hour: 10, count: 0, isPeak: false },
      { hour: 11, count: 0, isPeak: false },
      { hour: 12, count: 1, isPeak: true },
      { hour: 13, count: 0, isPeak: false },
      { hour: 14, count: 1, isPeak: true },
      { hour: 15, count: 0, isPeak: false },
      { hour: 16, count: 0, isPeak: false },
      { hour: 17, count: 0, isPeak: false },
      { hour: 18, count: 0, isPeak: false },
      { hour: 19, count: 0, isPeak: false },
      { hour: 20, count: 0, isPeak: false },
      { hour: 21, count: 0, isPeak: false },
      { hour: 22, count: 0, isPeak: false },
      { hour: 23, count: 0, isPeak: false },
    ]
  }
}

// ESS 배터리 상태 및 충전 이력 가져오기
export async function fetchChargingHistory(stationId: string, page = 0, size = 10): Promise<ChargingHistoryResponse> {
  try {
    console.log(`충전소 ${stationId}의 ESS 배터리 상태 및 충전 이력 요청 (페이지: ${page}, 크기: ${size})`)

    // API 엔드포인트 구성
    const url = `${API_BASE_URL}/monitoring/charging-history/${stationId}?page=${page}&size=${size}`
    console.log(`API 요청 URL: ${url}`)

    // 실제 API 호출
    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 요청 실패: ${response.status}, ${errorText}`)
    }
    const data = await response.json()
    console.log(`ESS 배터리 상태 및 충전 이력 응답 데이터:`, data)
    return data
  } catch (error) {
    console.error("ESS 배터리 상태 및 충전 이력 가져오기 실패:", error)
    throw error
  }
}
