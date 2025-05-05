// API 요청을 처리하는 서비스

// API 응답 타입 정의
export interface DischargeByHourData {
  hour: number
  dischargeKwh: number
}

export interface ChargerUsageData {
  timestamp: string
  chargerLocation: string
  chargerNumber: string
  usage: string
  price: string
  transactionId: string
}

export interface DailySummaryData {
  usage: number
  profit: number
  discharge: number
}

export interface StationData {
  stationId: string
  stationName: string
  address: string
  stationStatus: string
  regDate: string
  totalChargers: number
  avaliableCount: number
  occupiedCount: number
  unAvaliableCount: number
}

export interface StationOverviewData {
  stationId: string
  stationName: string
  latitude: number
  longitude: number
  status: string
}

export interface Transaction {
  id: string
  stationName: string
  category: string
  type: string
  startTime: string
  endTime: string
  transactionId: string
  userId: string
  vehicleInfo: string
  amount: string
  profit: string
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
  chargerUsage: [
    {
      timestamp: "2025-05-04T18:28:07",
      chargerLocation: "서울특별시 중구 세종대로 110",
      chargerNumber: "R1",
      usage: "10000(kWh)",
      price: "5,000(KRW)",
      transactionId: "tx-001",
    },
    {
      timestamp: "2025-05-04T16:28:07",
      chargerLocation: "서울특별시 중구 세종대로 110",
      chargerNumber: "R1",
      usage: "8000(kWh)",
      price: "4,000(KRW)",
      transactionId: "tx-002",
    },
    {
      timestamp: "2025-05-01T10:32:00",
      chargerLocation: "서울특별시 중구 세종대로 110",
      chargerNumber: "R1",
      usage: "45000(kWh)",
      price: "22,500(KRW)",
      transactionId: "tx-001",
    },
  ],
  dailySummary: {
    usage: 6,
    profit: 49500,
    discharge: 184000,
  },
  stations: [
    {
      stationId: "station-001",
      stationName: "rxx2",
      address: "서울특별시 중구 세종대로 110",
      stationStatus: "INACTIVE",
      regDate: "2025-04-17T11:20:00",
      totalChargers: 3,
      avaliableCount: 3,
      occupiedCount: 0,
      unAvaliableCount: 0,
    },
    {
      stationId: "station-002",
      stationName: "R1",
      address: "서울특별시 중구 세종대로 110",
      stationStatus: "ACTIVE",
      regDate: "2025-05-05T10:30:00",
      totalChargers: 3,
      avaliableCount: 1,
      occupiedCount: 1,
      unAvaliableCount: 1,
    },
  ],
  stationOverview: [
    {
      stationId: "station-001",
      stationName: "세종충전소 1",
      latitude: 37.5665,
      longitude: 126.978,
      status: "INACTIVE",
    },
    {
      stationId: "station-002",
      stationName: "세종충전소 2",
      latitude: 37.5645,
      longitude: 126.976,
      status: "ACTIVE",
    },
    {
      stationId: "station-003",
      stationName: "강남충전소",
      latitude: 37.5015,
      longitude: 127.0268,
      status: "ACTIVE",
    },
    {
      stationId: "station-004",
      stationName: "여의도충전소",
      latitude: 37.5256,
      longitude: 126.924,
      status: "MAINTENANCE",
    },
    {
      stationId: "station-005",
      stationName: "종로충전소",
      latitude: 37.572,
      longitude: 126.9794,
      status: "INACTIVE",
    },
    {
      stationId: "station-006",
      stationName: "서초충전소",
      latitude: 37.4835,
      longitude: 127.0322,
      status: "ACTIVE",
    },
    {
      stationId: "station-007",
      stationName: "송파충전소",
      latitude: 37.5145,
      longitude: 127.1058,
      status: "ACTIVE",
    },
  ],
  transactions: [
    {
      id: "tx-001",
      stationName: "세종충전소",
      category: "충전 내역",
      type: "충전",
      startTime: "2025-01-02 11:25:20",
      endTime: "2025-01-02 11:55:20",
      transactionId: "CSG-295710-CH",
      userId: "USER-1042",
      vehicleInfo: "Tesla-102",
      amount: "100,102(KWh)",
      profit: "12,360.7 (KRW)",
    },
    {
      id: "tx-002",
      stationName: "세종충전소",
      category: "충전 내역",
      type: "충전",
      startTime: "2025-01-02 12:25:20",
      endTime: "2025-01-02 12:55:20",
      transactionId: "CSG-295711-CH",
      userId: "USER-1042",
      vehicleInfo: "Ioniq6",
      amount: "100,102(KWh)",
      profit: "12,360.7 (KRW)",
    },
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

    if (endpoint === "/dashboard/chargers/usage") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.chargerUsage)
          resolve(MOCK_DATA.chargerUsage as unknown as T)
        }, 800)
      })
    }

    if (endpoint === "/dashboard/summary") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.dailySummary)
          resolve(MOCK_DATA.dailySummary as unknown as T)
        }, 800)
      })
    }

    if (endpoint === "/dashboard/stations") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.stations)
          resolve(MOCK_DATA.stations as unknown as T)
        }, 800)
      })
    }

    if (endpoint === "/overview/stations") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.stationOverview)
          resolve(MOCK_DATA.stationOverview as unknown as T)
        }, 800)
      })
    }

    if (endpoint === "/transactions") {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("모의 데이터:", MOCK_DATA.transactions)
          resolve(MOCK_DATA.transactions as unknown as T)
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

// 충전기 사용 정보 데이터 가져오기
export async function fetchChargerUsage(): Promise<ChargerUsageData[]> {
  try {
    console.log("충전기 사용 정보 데이터 요청 시작")
    const data = await apiRequest<ChargerUsageData[]>("/dashboard/chargers/usage")
    console.log("충전기 사용 정보 데이터 요청 완료:", data)
    return data
  } catch (error) {
    console.error("충전기 사용 정보 데이터를 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.chargerUsage
  }
}

// 일일 요약 정보 가져오기
export async function fetchDailySummary(): Promise<DailySummaryData> {
  try {
    console.log("일일 요약 정보 요청 시작")
    const data = await apiRequest<DailySummaryData>("/dashboard/summary")
    console.log("일일 요약 정보 요청 완료:", data)
    return data
  } catch (error) {
    console.error("일일 요약 정보를 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.dailySummary
  }
}

// 충전소 정보 가져오기
export async function fetchStations(): Promise<StationData[]> {
  try {
    console.log("충전소 정보 요청 시작")
    const data = await apiRequest<StationData[]>("/dashboard/stations")
    console.log("충전소 정보 요청 완료:", data)
    return data
  } catch (error) {
    console.error("충전소 정보를 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.stations
  }
}

// 충전소 위치 정보 가져오기
export async function fetchStationOverview(): Promise<StationOverviewData[]> {
  try {
    console.log("충전소 위치 정보 요청 시작")
    const data = await apiRequest<StationOverviewData[]>("/overview/stations")
    console.log("충전소 위치 정보 요청 완료:", data)
    return data
  } catch (error) {
    console.error("충전소 위치 정보를 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.stationOverview
  }
}

// 거래 내역 가져오기
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    console.log("거래 내역 요청 시작")
    const data = await apiRequest<Transaction[]>("/transactions")
    console.log("거래 내역 요청 완료:", data)
    return data
  } catch (error) {
    console.error("거래 내역을 가져오는 중 오류 발생:", error)

    // 오류 발생 시 모의 데이터 반환 (개발 편의를 위해)
    console.log("오류 발생으로 모의 데이터 반환")
    return MOCK_DATA.transactions
  }
}
