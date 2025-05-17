import { API_BASE_URL } from "./apiConfig"
import type { StatisticsData, ChartData, PieChartData } from "@/types/chart"
import {
  generateCostData,
  generateChargingVolumeData,
  generateChargingInfoData,
  generateChargerStatusData,
  generatePowerTradingData,
} from "@/lib/statistics-utils"

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

export async function fetchCostData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const data = await apiRequest<{
      barChartData?: ChartData[]
      lineChartData?: ChartData[]
      pieChartData?: PieChartData[]
    }>(`/statistics/cost?chartType=${chartType}&timeRange=${timeRange}`)

    // API 응답에서 필요한 데이터만 추출
    return {
      barChartData: data.barChartData || [],
      lineChartData: data.lineChartData || [],
      pieChartData: data.pieChartData || [],
    }
  } catch (error) {
    console.error("비용 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return generateCostData()
  }
}

export async function fetchChargingVolumeData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const data = await apiRequest<{
      barChartData?: ChartData[]
      lineChartData?: ChartData[]
      pieChartData?: PieChartData[]
    }>(`/statistics/charging-volume?chartType=${chartType}&timeRange=${timeRange}`)

    return {
      barChartData: data.barChartData || [],
      lineChartData: data.lineChartData || [],
      pieChartData: data.pieChartData || [],
    }
  } catch (error) {
    console.error("충전량 데이터 가져오기 실패:", error)
    return generateChargingVolumeData()
  }
}

export async function fetchChargingInfoData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const data = await apiRequest<{
      barChartData?: ChartData[]
      lineChartData?: ChartData[]
      pieChartData?: PieChartData[]
    }>(`/statistics/charging-info?chartType=${chartType}&timeRange=${timeRange}`)

    return {
      barChartData: data.barChartData || [],
      lineChartData: data.lineChartData || [],
      pieChartData: data.pieChartData || [],
    }
  } catch (error) {
    console.error("충전 정보 데이터 가져오기 실패:", error)
    return generateChargingInfoData()
  }
}

export async function fetchChargerStatusData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const data = await apiRequest<{
      barChartData?: ChartData[]
      lineChartData?: ChartData[]
      pieChartData?: PieChartData[]
    }>(`/statistics/charger-status?chartType=${chartType}&timeRange=${timeRange}`)

    return {
      barChartData: data.barChartData || [],
      lineChartData: data.lineChartData || [],
      pieChartData: data.pieChartData || [],
    }
  } catch (error) {
    console.error("충전기 상태 데이터 가져오기 실패:", error)
    return generateChargerStatusData()
  }
}

export async function fetchPowerTradingData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const data = await apiRequest<{
      barChartData?: ChartData[]
      lineChartData?: ChartData[]
      pieChartData?: PieChartData[]
    }>(`/statistics/power-trading?chartType=${chartType}&timeRange=${timeRange}`)

    return {
      barChartData: data.barChartData || [],
      lineChartData: data.lineChartData || [],
      pieChartData: data.pieChartData || [],
    }
  } catch (error) {
    console.error("전력 거래 데이터 가져오기 실패:", error)
    return generatePowerTradingData()
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
