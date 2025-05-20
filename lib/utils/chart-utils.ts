import type { ChartData, StatisticsData } from "@/types/chart"

/**
 * 날짜 문자열에서 연도를 추출합니다.
 */
function getYear(dateStr: string): string {
  return dateStr.substring(0, 4)
}

/**
 * 날짜 문자열에서 월을 추출합니다.
 */
function getMonth(dateStr: string): string {
  return dateStr.substring(0, 7) // YYYY-MM 형식
}

/**
 * 날짜 문자열에서 주차를 계산합니다.
 * ISO 8601 표준에 따라 주의 시작은 월요일입니다.
 */
function getWeek(dateStr: string): string {
  const date = new Date(dateStr)
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000

  // 첫째 주의 첫째 날이 월요일이 아닌 경우 조정
  const firstDayOfWeek = firstDayOfYear.getDay() || 7 // 일요일(0)을 7로 변환
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfWeek - 1) / 7)

  return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, "0")}`
}

/**
 * 날짜별 데이터를 지정된 기간(일/주/월/년)으로 집계합니다.
 * 모든 데이터를 처리하고 날짜 내림차순으로 정렬합니다.
 */
export function aggregateDataByPeriod(
  data: { label: string; value: number }[],
  period: "day" | "week" | "month" | "year",
): { label: string; value: number }[] {
  if (!data || data.length === 0) return []

  // 일별 데이터인 경우 그대로 반환 (정렬만 수행)
  if (period === "day") {
    // 날짜 기준 내림차순으로 정렬
    return [...data].sort((a, b) => b.label.localeCompare(a.label))
  }

  const aggregated: Record<string, number> = {}

  data.forEach((item) => {
    let key: string

    switch (period) {
      case "week":
        key = getWeek(item.label)
        break
      case "month":
        key = getMonth(item.label)
        break
      case "year":
        key = getYear(item.label)
        break
      default:
        key = item.label
    }

    if (!aggregated[key]) {
      aggregated[key] = 0
    }
    aggregated[key] += item.value
  })

  // 결과를 배열로 변환하고 날짜 내림차순으로 정렬
  return Object.entries(aggregated)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.label.localeCompare(a.label))
}

/**
 * API 응답 데이터를 내부 차트 데이터 형식으로 변환합니다.
 */
export function convertApiDataToChartData(
  apiData: { label: string; value: number }[],
  period: "day" | "week" | "month" | "year",
): ChartData[] {
  const aggregatedData = aggregateDataByPeriod(apiData, period)

  return aggregatedData.map((item, index) => ({
    x: index,
    y: item.value,
    label: formatPeriodLabel(item.label, period),
  }))
}

/**
 * 기간별 라벨을 사용자 친화적인 형식으로 포맷팅합니다.
 */
function formatPeriodLabel(label: string, period: "day" | "week" | "month" | "year"): string {
  switch (period) {
    case "day":
      // YYYY-MM-DD -> MM/DD
      if (label.length >= 10) {
        return label.substring(5, 10).replace("-", "/")
      }
      return label
    case "week":
      // YYYY-WNN -> YYYY년 NN주차
      const [year, week] = label.split("-W")
      return `${year}년 ${week}주차`
    case "month":
      // YYYY-MM -> YYYY년 MM월
      const [yearPart, monthPart] = label.split("-")
      return `${yearPart}년 ${monthPart}월`
    case "year":
      // YYYY -> YYYY년
      return `${label}년`
    default:
      return label
  }
}

/**
 * 전체 통계 데이터를 지정된 기간으로 집계합니다.
 */
export function aggregateStatisticsData(
  data: StatisticsData | null,
  period: "day" | "week" | "month" | "year",
): StatisticsData | null {
  if (!data) return null

  // API 응답 형식의 데이터를 추출
  const barApiData = data.barChartData.map((item) => ({
    label: item.label || `Item ${item.x}`,
    value: item.y,
  }))

  const lineApiData = data.lineChartData.map((item) => ({
    label: item.label || `Item ${item.x}`,
    value: item.y,
  }))

  // 집계된 데이터로 변환
  const aggregatedBarData = convertApiDataToChartData(barApiData, period)
  const aggregatedLineData = convertApiDataToChartData(lineApiData, period)

  // 원형 차트 데이터는 그대로 유지
  return {
    barChartData: aggregatedBarData,
    lineChartData: aggregatedLineData,
    pieChartData: data.pieChartData,
  }
}

/**
 * 차트 표시용으로 최신 데이터 N개만 필터링합니다.
 */
export function limitToLatestData(data: StatisticsData | null, limit = 7): StatisticsData | null {
  if (!data) return null

  return {
    barChartData: data.barChartData.slice(0, limit),
    lineChartData: data.lineChartData.slice(0, limit),
    pieChartData: data.pieChartData, // 파이 차트는 제한하지 않음
  }
}
