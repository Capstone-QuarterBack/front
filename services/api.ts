// API 요청을 처리하는 서비스

// API 응답 타입 정의
export interface DischargeByHourData {
  hour: number
  dischargeKwh: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// API 기본 설정
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초
}

// 개발 환경에서 사용할 모의(mock) 데이터
const MOCK_DATA = {
  dischargeByHour: [
    { hour: 0, dischargeKwh: 0 },
    { hour: 1, dischargeKwh: 0 },
    { hour: 2, dischargeKwh: 0 },
    { hour: 3, dischargeKwh: 0 },
    { hour: 4, dischargeKwh: 0 },
    { hour: 5, dischargeKwh: 0 },
    { hour: 6, dischargeKwh: 0 },
    { hour: 7, dischargeKwh: 0 },
    { hour: 8, dischargeKwh: 0 },
    { hour: 9, dischargeKwh: 0 },
    { hour: 10, dischargeKwh: 54000 },
    { hour: 11, dischargeKwh: 0 },
    { hour: 12, dischargeKwh: 15000 },
    { hour: 13, dischargeKwh: 0 },
    { hour: 14, dischargeKwh: 12000 },
    { hour: 15, dischargeKwh: 0 },
    { hour: 16, dischargeKwh: 8000 },
    { hour: 17, dischargeKwh: 0 },
    { hour: 18, dischargeKwh: 10000 },
    { hour: 19, dischargeKwh: 0 },
    { hour: 20, dischargeKwh: 0 },
    { hour: 21, dischargeKwh: 0 },
    { hour: 22, dischargeKwh: 0 },
    { hour: 23, dischargeKwh: 0 },
  ],
}

// API 요청 함수
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 모의 데이터 사용 여부 확인 (기본값은 false로 설정)
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true"

  console.log("API 요청:", endpoint)
  console.log("모의 데이터 사용:", useMockData)
  console.log("API 기본 URL:", API_CONFIG.baseUrl)

  // 모의 데이터 사용 설정이 되어 있는 경우
  if (useMockData) {
    console.log("모의 데이터 반환")

    // 엔드포인트에 따라 적절한 모의 데이터 반환
    if (endpoint === "/dashboard/discharge-by-hour") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.dischargeByHour)
          resolve(MOCK_DATA.dischargeByHour as unknown as T)
        }, 800)
      })
    }

    // 지원하지 않는 엔드포인트
    return Promise.reject(new Error(`지원하지 않는 모의 데이터 엔드포인트: ${endpoint}`))
  }

  // 실제 API 요청 로직
  const url = `${API_CONFIG.baseUrl}${endpoint}`
  console.log("요청 URL:", url)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    console.log("API 요청 시작...")
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("API 응답 상태:", response.status)

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    const data = await response.json()
    console.log("API 응답 데이터:", data)
    return data
  } catch (error) {
    console.error("API 요청 오류:", error)
    if ((error as Error).name === "AbortError") {
      throw new Error("API 요청 시간 초과")
    }
    throw error
  }
}

// 시간대별 발전량 데이터 가져오기
export async function fetchDischargeByHour(): Promise<DischargeByHourData[]> {
  try {
    console.log("시간대별 발전량 데이터 요청 시작")
    const data = await apiRequest<DischargeByHourData[]>("/dashboard/discharge-by-hour")
    console.log("시간대별 발전량 데이터 요청 완료:", data)
    return data
  } catch (error) {
    console.error("시간대별 발전량 데이터를 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.dischargeByHour
  }
}

// 다른 API 함수들을 여기에 추가할 수 있습니다.
// 예: 일일 정보, 충전기 사용 정보, 전기 거래 현황 등
