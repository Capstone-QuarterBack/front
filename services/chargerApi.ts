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
  } catch (error) {
    console.error(`충전기 ${evseId}의 ${status} 정보 가져오기 실패:`, error)
    throw error
  }
}
