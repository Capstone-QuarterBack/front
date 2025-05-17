import { API_BASE_URL } from "./apiConfig"
import type { DateBasedData } from "@/lib/utils/statistics-utils"

// API 응답 타입
export interface StatisticsSummary {
  totalChargingVolume: number
  totalChargingCount: number
  totalRevenue: number
  averageChargingTime: number
  comparisonWithPrevious: {
    volumeChangePercent: number
    countChangePercent: number
    revenueChangePercent: number
    timeChangePercent: number
  }
}

export interface ChargerUptimeData {
  overallUptime: number
  changePercent: number
  stationUptime: Array<{
    name: string
    uptime: number
  }>
}

export interface ChargerFailureData {
  chargerFailures: Array<{
    id: string
    name: string
    failureCount: number
  }>
}

export interface RepairTimeData {
  averageRepairTime: number
  repairTimeByType: Array<{
    type: string
    time: number
  }>
}

export interface PowerTradingRevenueData {
  netRevenue: number
  salesRevenue: number
  purchaseCost: number
}

export interface PowerTradingPriceData {
  averagePrice: number
  priceByTimeSlot: Array<{
    timeSlot: string
    price: number
  }>
}

export interface PowerTradingVolumeData {
  totalVolume: number
  salesVolume: number
  purchaseVolume: number
  peakTradingDay: {
    date: string
    volume: number
  }
  lowestTradingDay: {
    date: string
    volume: number
  }
}

// API 응답 타입 추가
export interface ApiDataPoint {
  date: string
  value: number
  category?: string
}

export interface ApiStatisticsResponse {
  data: ApiDataPoint[]
}

// API 요청 함수
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10초 타임아웃

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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

// 통계 데이터 API 함수
export async function fetchStatisticsSummary(timeRange: string): Promise<StatisticsSummary> {
  try {
    return await apiRequest<StatisticsSummary>(`/statistics/summary?timeRange=${timeRange}`)
  } catch (error) {
    console.error("통계 요약 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      totalChargingVolume: 128532,
      totalChargingCount: 5248,
      totalRevenue: 32450000,
      averageChargingTime: 42,
      comparisonWithPrevious: {
        volumeChangePercent: 12.3,
        countChangePercent: 8.7,
        revenueChangePercent: 15.2,
        timeChangePercent: -3.5,
      },
    }
  }
}

// 비용 데이터 가져오기
export async function fetchCostData(chartType: string, timeRange: string): Promise<DateBasedData[]> {
  try {
    const response = await apiRequest<ApiStatisticsResponse>(`/statistics/cost?timeRange=${timeRange}`)
    return response.data.map((item) => ({
      date: new Date(item.date),
      value: item.value,
      category: item.category,
    }))
  } catch (error) {
    console.error("비용 데이터 가져오기 실패:", error)
    // 목데이터 생성
    return generateMockDateData(100)
  }
}

// 충전량 데이터 가져오기
export async function fetchChargingVolumeData(chartType: string, timeRange: string): Promise<DateBasedData[]> {
  try {
    const response = await apiRequest<ApiStatisticsResponse>(`/statistics/charging-volume?timeRange=${timeRange}`)
    return response.data.map((item) => ({
      date: new Date(item.date),
      value: item.value,
      category: item.category,
    }))
  } catch (error) {
    console.error("충전량 데이터 가져오기 실패:", error)
    return generateMockDateData(100)
  }
}

// 충전 정보 데이터 가져오기
export async function fetchChargingInfoData(chartType: string, timeRange: string): Promise<DateBasedData[]> {
  try {
    const response = await apiRequest<ApiStatisticsResponse>(`/statistics/charging-info?timeRange=${timeRange}`)
    return response.data.map((item) => ({
      date: new Date(item.date),
      value: item.value,
      category: item.category,
    }))
  } catch (error) {
    console.error("충전 정보 데이터 가져오기 실패:", error)
    return generateMockDateData(100)
  }
}

// 충전기 상태 데이터 가져오기
export async function fetchChargerStatusData(chartType: string, timeRange: string): Promise<DateBasedData[]> {
  try {
    const response = await apiRequest<ApiStatisticsResponse>(`/statistics/charger-status?timeRange=${timeRange}`)
    return response.data.map((item) => ({
      date: new Date(item.date),
      value: item.value,
      category: item.category,
    }))
  } catch (error) {
    console.error("충전기 상태 데이터 가져오기 실패:", error)
    return generateMockDateData(100)
  }
}

// 전력 거래 데이터 가져오기
export async function fetchPowerTradingData(chartType: string, timeRange: string): Promise<DateBasedData[]> {
  try {
    const response = await apiRequest<ApiStatisticsResponse>(`/statistics/power-trading?timeRange=${timeRange}`)
    return response.data.map((item) => ({
      date: new Date(item.date),
      value: item.value,
      category: item.category,
    }))
  } catch (error) {
    console.error("전력 거래 데이터 가져오기 실패:", error)
    return generateMockDateData(100)
  }
}

export async function fetchChargerUptimeData(timeRange: string): Promise<ChargerUptimeData> {
  try {
    return await apiRequest<ChargerUptimeData>(`/statistics/charger-uptime?timeRange=${timeRange}`)
  } catch (error) {
    console.error("충전기 가동률 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      overallUptime: 97.2,
      changePercent: 1.5,
      stationUptime: [
        { name: "충전소 A", uptime: 98.5 },
        { name: "충전소 B", uptime: 97.8 },
        { name: "충전소 C", uptime: 95.2 },
        { name: "충전소 D", uptime: 97.3 },
      ],
    }
  }
}

export async function fetchChargerFailureData(timeRange: string): Promise<ChargerFailureData> {
  try {
    return await apiRequest<ChargerFailureData>(`/statistics/charger-failures?timeRange=${timeRange}`)
  } catch (error) {
    console.error("충전기 고장 빈도 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      chargerFailures: [
        { id: "1", name: "충전기 #1", failureCount: 15 },
        { id: "2", name: "충전기 #2", failureCount: 8 },
        { id: "3", name: "충전기 #3", failureCount: 22 },
        { id: "4", name: "충전기 #4", failureCount: 5 },
        { id: "5", name: "충전기 #5", failureCount: 12 },
      ],
    }
  }
}

export async function fetchRepairTimeData(timeRange: string): Promise<RepairTimeData> {
  try {
    return await apiRequest<RepairTimeData>(`/statistics/repair-time?timeRange=${timeRange}`)
  } catch (error) {
    console.error("수리 시간 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      averageRepairTime: 4.2,
      repairTimeByType: [
        { type: "하드웨어 오류", time: 6.5 },
        { type: "소프트웨어 오류", time: 2.1 },
        { type: "네트워크 오류", time: 1.8 },
        { type: "전원 공급 문제", time: 5.4 },
        { type: "기타 오류", time: 3.7 },
      ],
    }
  }
}

export async function fetchPowerTradingRevenueData(timeRange: string): Promise<PowerTradingRevenueData> {
  try {
    return await apiRequest<PowerTradingRevenueData>(`/statistics/power-trading-revenue?timeRange=${timeRange}`)
  } catch (error) {
    console.error("전력 거래 수익 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      netRevenue: 12450000,
      salesRevenue: 18320000,
      purchaseCost: 5870000,
    }
  }
}

export async function fetchPowerTradingPriceData(timeRange: string): Promise<PowerTradingPriceData> {
  try {
    return await apiRequest<PowerTradingPriceData>(`/statistics/power-trading-price?timeRange=${timeRange}`)
  } catch (error) {
    console.error("전력 거래 가격 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      averagePrice: 133,
      priceByTimeSlot: [
        { timeSlot: "심야 (23-06시)", price: 85 },
        { timeSlot: "오전 (06-10시)", price: 120 },
        { timeSlot: "주간 (10-17시)", price: 150 },
        { timeSlot: "저녁 (17-23시)", price: 180 },
      ],
    }
  }
}

export async function fetchPowerTradingVolumeData(timeRange: string): Promise<PowerTradingVolumeData> {
  try {
    return await apiRequest<PowerTradingVolumeData>(`/statistics/power-trading-volume?timeRange=${timeRange}`)
  } catch (error) {
    console.error("전력 거래량 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      totalVolume: 85320,
      salesVolume: 52180,
      purchaseVolume: 33140,
      peakTradingDay: {
        date: "2023-05-12",
        volume: 4250,
      },
      lowestTradingDay: {
        date: "2023-05-03",
        volume: 1820,
      },
    }
  }
}

// 데이터 내보내기 함수
export function exportStatisticsData(format: string, dataType: string, timeRange: string): string {
  // 실제로는 API 요청을 통해 파일을 다운로드하지만, 여기서는 URL만 반환
  return `${API_BASE_URL}/statistics/export?format=${format}&dataType=${dataType}&timeRange=${timeRange}`
}

// 테스트용 목데이터 생성 함수
function generateMockDateData(days = 100): DateBasedData[] {
  const data: DateBasedData[] = []
  const categories = ["충전소 A", "충전소 B", "충전소 C", "충전소 D"]

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)

  // 각 날짜에 대해 여러 데이터 포인트 생성
  for (let d = 0; d < days; d++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + d)

    // 하루에 여러 시간대 데이터 생성
    for (let h = 0; h < 24; h++) {
      currentDate.setHours(h)

      // 각 카테고리별 데이터 생성
      categories.forEach((category) => {
        // 주말에는 더 적은 값, 평일 낮에는 더 높은 값 생성
        const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6
        const isDaytime = h >= 8 && h <= 18

        let baseValue = Math.floor(Math.random() * 50) + 10
        if (isWeekend) baseValue = Math.floor(baseValue * 0.7)
        if (isDaytime) baseValue = Math.floor(baseValue * 1.5)

        data.push({
          date: new Date(currentDate),
          value: baseValue,
          category,
        })
      })
    }
  }

  return data
}
