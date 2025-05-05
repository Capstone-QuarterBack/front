// API 요청을 처리하는 서비스

export interface DischargeByHourData {
  hour: number
  dischargeKwh: number
}

export async function fetchDischargeByHour(): Promise<DischargeByHourData[]> {
  try {
    const response = await fetch("http://localhost:8080/api/dashboard/discharge-by-hour")

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    const data: DischargeByHourData[] = await response.json()
    return data
  } catch (error) {
    console.error("시간대별 발전량 데이터를 가져오는 중 오류 발생:", error)
    throw error
  }
}
