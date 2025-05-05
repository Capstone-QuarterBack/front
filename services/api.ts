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
  dischargeByHour: Array(24)
    .fill(0)
    .map((_, hour) => ({
      hour,
      dischargeKwh: Math.floor(Math.random() * 5000) + 1000, // 1000 ~ 6000 kWh
    })),
}

// API 요청 함수
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 개발 환경이거나 모의 데이터 사용 설정이 되어 있는 경우
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || process.env.NODE_ENV === "development") {
    console.log(`모의 데이터 사용: ${endpoint}`)

    // 엔드포인트에 따라 적절한 모의 데이터 반환
    if (endpoint === "/dashboard/discharge-by-hour") {
      return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_DATA.dischargeByHour as unknown as T), 800)
      })
    }

    // 지원하지 않는 엔드포인트
    return Promise.reject(new Error(`지원하지 않는 모의 데이터 엔드포인트: ${endpoint}`))
  }

  // 실제 API 요청 로직
  const url = `${API_CONFIG.baseUrl}${endpoint}`
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("API 요청 시간 초과")
    }
    throw error
  }
}

// 시간대별 발전량 데이터 가져오기
export async function fetchDischargeByHour(): Promise<DischargeByHourData[]> {
  try {
    return await apiRequest<DischargeByHourData[]>("/dashboard/discharge-by-hour")
  } catch (error) {
    console.error("시간대별 발전량 데이터를 가져오는 중 오류 발생:", error)
    throw error
  }
}

// 다른 API 함수들을 여기에 추가할 수 있습니다.
// 예: 일일 정보, 충전기 사용 정보, 전기 거래 현황 등
