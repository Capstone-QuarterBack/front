import { API_BASE_URL } from "./apiConfig"
import type { StatisticsData } from "@/types/chart"
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

// API response wrapper type
export interface ApiResponse<T> {
  status: string
  data: T
}

export interface ChargerFailureData {
  chargerFailures: Array<{
    id?: string
    name: string
    failureCount: number
    stationName: string
  }>
}

export interface RepairTimeData {
  averageRepairTime: number
  repairTimeByType: Array<{
    type: string
    time: number
  }>
}

// Update the PowerTradingRevenueData interface to match the new API response format
export interface PowerTradingRevenueData {
  // Legacy fields for backward compatibility
  salesRevenue?: number
  purchaseCost?: number

  // New fields from the API
  netRevenue: number
  percentText: string
}

export interface PowerTradingPriceData {
  // Legacy fields for backward compatibility
  averagePrice?: number
  priceByTimeSlot?: Array<{
    timeSlot: string
    price: number
  }>

  // New fields from the API
  timeSlotPrices: Array<{
    timeSlot: string
    price: number
  }>
}

// Updated interface to match the new API response format
export interface PowerTradingVolumeData {
  // Legacy fields for backward compatibility
  totalVolume?: number
  salesVolume?: number
  purchaseVolume?: number
  peakTradingDay?: {
    date: string
    volume: number
  }
  lowestTradingDay?: {
    date: string
    volume: number
  }

  // New fields from the API
  netVolume: number
  percentText: string
  minVolume: number
  minVolumeDate: string
  maxVolume: number
  maxVolumeDate: string
}

// API 응답 타입
export interface ApiChartData {
  label: string
  value: number
  id?: string
}

export interface ApiStatisticsResponse {
  barChartData: ApiChartData[]
  lineChartData: ApiChartData[]
  pieChartData: ApiChartData[]
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

// API 응답을 내부 형식으로 변환하는 함수
function convertApiResponseToChartData(apiResponse: ApiStatisticsResponse): StatisticsData {
  // 날짜 내림차순으로 정렬 (모든 데이터 처리)
  const sortedBarData = [...apiResponse.barChartData].sort((a, b) => b.label.localeCompare(a.label))
  const sortedLineData = [...apiResponse.lineChartData].sort((a, b) => b.label.localeCompare(a.label))

  // barChartData 변환
  const barChartData = sortedBarData.map((item, index) => ({
    x: index,
    y: item.value,
    label: item.label, // 원래 날짜 라벨 유지
  }))

  // lineChartData 변환
  const lineChartData = sortedLineData.map((item, index) => ({
    x: index,
    y: item.value,
    label: item.label, // 원래 날짜 라벨 유지
  }))

  // pieChartData 변환 (파이 차트는 정렬 필요 없음)
  const pieChartData = apiResponse.pieChartData.map((item) => ({
    label: item.label,
    value: item.value,
    color: getColorForLabel(item.label),
  }))

  return {
    barChartData,
    lineChartData,
    pieChartData,
  }
}

// 라벨에 따른 색상 지정 함수
function getColorForLabel(label: string): string {
  const colorMap: Record<string, string> = {
    정상: "#4CAF50",
    고장: "#F44336",
    점검중: "#FFC107",
    충전중: "#2196F3",
    대기중: "#9C27B0",
    오프라인: "#607D8B",
    주간: "#FFC107",
    야간: "#3F51B5",
    급속: "#FF5722",
    완속: "#2196F3",
  }

  // If it's a station name (not in our predefined map), assign a color based on hash
  if (!colorMap[label]) {
    // Simple hash function to generate consistent colors for station names
    let hash = 0
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Convert to RGB
    const r = (hash & 0xff0000) >> 16
    const g = (hash & 0x00ff00) >> 8
    const b = hash & 0x0000ff

    return `rgb(${Math.abs((r % 200) + 55)}, ${Math.abs((g % 200) + 55)}, ${Math.abs((b % 200) + 55)})`
  }

  return colorMap[label] || "#9E9E9E" // 기본 색상
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

// 차트 타입을 API 형식으로 변환하는 함수
function convertChartTypeToApiFormat(chartType: string): string {
  switch (chartType.toLowerCase()) {
    case "bar":
      return "BAR"
    case "pie":
      return "PIE"
    case "line":
      return "LINE"
    default:
      return "BAR"
  }
}

export async function fetchCostData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const apiChartType = convertChartTypeToApiFormat(chartType)
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/cost?chartType=${apiChartType}&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("비용 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return generateCostData()
  }
}

export async function fetchChargingVolumeData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const apiChartType = convertChartTypeToApiFormat(chartType)
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/charging-volume?chartType=${apiChartType}&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("충전량 데이터 가져오기 실패:", error)
    return generateChargingVolumeData()
  }
}

export async function fetchChargingInfoData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const apiChartType = convertChartTypeToApiFormat(chartType)
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/transaction-count?chartType=${apiChartType}&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("충전 횟수 데이터 가져오기 실패:", error)
    return generateChargingInfoData()
  }
}

export async function fetchChargerStatusData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const apiChartType = convertChartTypeToApiFormat(chartType)
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/charger-status?chartType=${apiChartType}&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("충전기 상태 데이터 가져오기 실패:", error)
    return generateChargerStatusData()
  }
}

export async function fetchPowerTradingData(chartType: string, timeRange: string): Promise<StatisticsData> {
  try {
    const apiChartType = convertChartTypeToApiFormat(chartType)
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/power-trading?chartType=${apiChartType}&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("전력 거래 데이터 가져오기 실패:", error)
    return generatePowerTradingData()
  }
}

export interface UptimeData {
  stationUptime: Array<{
    name: string
    uptime: number
  }>
  overallUptime: number
}

export async function fetchChargerUptimeData(timeRange: string): Promise<ChargerUptimeData> {
  try {
    // Updated to use the new API endpoint and response format with proper typing
    const response = await apiRequest<ApiResponse<ChargerUptimeData>>(`/statistics/charger-uptime`)

    // Check if response and response.data exist
    if (!response || !response.data) {
      throw new Error("Invalid API response format")
    }

    const uptimeData = response.data

    // Convert uptime values from decimal to percentage for display
    uptimeData.overallUptime = uptimeData.overallUptime * 100

    // Convert each station's uptime to percentage if stationUptime exists
    if (uptimeData.stationUptime && Array.isArray(uptimeData.stationUptime)) {
      uptimeData.stationUptime = uptimeData.stationUptime.map((station) => ({
        ...station,
        uptime: station.uptime * 100,
      }))
    } else {
      // Ensure stationUptime is always an array
      uptimeData.stationUptime = []
    }

    return uptimeData
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
    // Changed endpoint from /statistics/charger-failures to /statistics/charger-troubles
    const response = await apiRequest<ApiResponse<ChargerFailureData>>(`/statistics/charger-troubles`)

    // Check if response and response.data exist
    if (!response || !response.data) {
      throw new Error("Invalid API response format")
    }

    // Return the data property from the response
    return response.data
  } catch (error) {
    console.error("충전기 고장 빈도 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      chargerFailures: [
        { id: "1", name: "충전기 #1", failureCount: 0, stationName: "sejong" },
        { id: "2", name: "충전기 #2", failureCount: 0, stationName: "sejong" },
        { id: "3", name: "충전기 #3", failureCount: 0, stationName: "sejong" },
        { id: "4", name: "충전기 #4", failureCount: 0, stationName: "sejong" },
        { id: "5", name: "충전기 #5", failureCount: 0, stationName: "sejong" },
      ],
    }
  }
}

export async function fetchRepairTimeData(timeRange: string): Promise<RepairTimeData> {
  // Don't make an actual API call, just return mock data
  return {
    averageRepairTime: 0,
    repairTimeByType: [
      { type: "하드웨어 오류", time: 0 },
      { type: "소프트웨어 오류", time: 0 },
      { type: "네트워크 오류", time: 0 },
      { type: "전원 공급 문제", time: 0 },
      { type: "기타 오류", time: 0 },
    ],
  }
}

// Update the fetchPowerTradingRevenueData function to handle the new API response format
export async function fetchPowerTradingRevenueData(timeRange: string): Promise<PowerTradingRevenueData> {
  try {
    // Updated to use the new API endpoint and response format
    const response = await apiRequest<ApiResponse<PowerTradingRevenueData>>(`/statistics/power-trading-revenue`)

    // Check if response and response.data exist
    if (!response || !response.data) {
      throw new Error("Invalid API response format")
    }

    // Return the data property from the response
    return response.data
  } catch (error) {
    console.error("전력 거래 수익 데이터 가져오기 실패:", error)
    // 목데이터 반환 - updated to match the new format
    return {
      netRevenue: 4900,
      percentText: "-27.9%",
      // Legacy fields for backward compatibility
      salesRevenue: 0,
      purchaseCost: 0,
    }
  }
}

export async function fetchPowerTradingPriceData(timeRange: string): Promise<PowerTradingPriceData> {
  try {
    // Updated to use the new API endpoint and response format
    const response = await apiRequest<ApiResponse<PowerTradingPriceData>>(`/statistics/power-trading-price`)

    // Check if response and response.data exist
    if (!response || !response.data) {
      throw new Error("Invalid API response format")
    }

    // Return the data property from the response
    return response.data
  } catch (error) {
    console.error("전력 거래 가격 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      timeSlotPrices: [
        { timeSlot: "심야 (23-06시)", price: 85 },
        { timeSlot: "오전 (06-10시)", price: 120 },
        { timeSlot: "주간 (10-17시)", price: 150 },
        { timeSlot: "저녁 (17-23시)", price: 180 },
      ],
      // Legacy fields for backward compatibility
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
    // Updated to use the new API endpoint and response format
    const response = await apiRequest<ApiResponse<PowerTradingVolumeData>>(`/statistics/power-trading-volume`)

    // Check if response and response.data exist
    if (!response || !response.data) {
      throw new Error("Invalid API response format")
    }

    // Return the data property from the response
    return response.data
  } catch (error) {
    console.error("전력 거래량 데이터 가져오기 실패:", error)
    // 목데이터 반환 - updated to match the new format
    return {
      netVolume: 80.5,
      percentText: "254.6%",
      minVolume: 15,
      minVolumeDate: "2025-05-15T10:00:00",
      maxVolume: 50.5,
      maxVolumeDate: "2025-05-18T09:30:00",
      // Legacy fields for backward compatibility
      totalVolume: 80.5,
      salesVolume: 52.5,
      purchaseVolume: 28,
      peakTradingDay: {
        date: "2025-05-18",
        volume: 50.5,
      },
      lowestTradingDay: {
        date: "2025-05-15",
        volume: 15,
      },
    }
  }
}

// Add this new function after the other fetch functions
export async function fetchTimeTypeMeterValueData(): Promise<StatisticsData> {
  try {
    const apiResponse = await apiRequest<ApiStatisticsResponse>(`/statistics/time-type-metervalue?chartType=PIE`)
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("시간대별 충전량 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      barChartData: [],
      lineChartData: [],
      pieChartData: [
        { label: "주간", value: 52.7, color: "#4CAF50" },
        { label: "야간", value: 47.3, color: "#2196F3" },
      ],
    }
  }
}

// Add this new function after the other fetch functions
export async function fetchStationPriceDistributionData(): Promise<StatisticsData> {
  try {
    const apiResponse = await apiRequest<ApiStatisticsResponse>(`/statistics/stations-price?chartType=PIE`)
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("충전소별 비용 분포 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      barChartData: [],
      lineChartData: [],
      pieChartData: [
        { label: "세종대학교", value: 7300, color: "#4CAF50" },
        { label: "광진구청", value: 1200, color: "#2196F3" },
        { label: "건국대학교", value: 800, color: "#FFC107" },
      ],
    }
  }
}

// Add this new function for charging info data
export async function fetchChargingTypeData(timeRange: string): Promise<StatisticsData> {
  try {
    const apiResponse = await apiRequest<ApiStatisticsResponse>(
      `/statistics/charging-info?chartType=PIE&timeRange=${timeRange}`,
    )
    return convertApiResponseToChartData(apiResponse)
  } catch (error) {
    console.error("충전 결과 분포 데이터 가져오기 실패:", error)
    // 목데이터 반환
    return {
      barChartData: [],
      lineChartData: [],
      pieChartData: [
        { label: "급속", value: 50, color: "#FF5722" },
        { label: "완속", value: 50, color: "#2196F3" },
      ],
    }
  }
}

// 데이터 내보내기 함수
export function exportStatisticsData(format: string, dataType: string, timeRange: string): string {
  // 실제로는 API 요청을 통해 파일을 다운로드하지만, 여기서는 URL만 반환
  return `${API_BASE_URL}/statistics/export?format=${format}&dataType=${dataType}&timeRange=${timeRange}`
}

export async function fetchUptimeData(startDate: string, endDate: string): Promise<UptimeData> {
  try {
    const response = await apiRequest<UptimeData>(`/statistics/uptime?startDate=${startDate}&endDate=${endDate}`)

    // Ensure we have a valid response structure
    if (!response || !response.stationUptime) {
      console.warn("Invalid uptime data response format:", response)
      return {
        stationUptime: [],
        overallUptime: 0,
      }
    }

    return response
  } catch (error) {
    console.error("Error fetching uptime data:", error)
    // Return default data structure on error
    return {
      stationUptime: [],
      overallUptime: 0,
    }
  }
}
