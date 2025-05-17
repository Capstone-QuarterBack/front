import type { ChartData, PieChartData, StatisticsData } from "@/types/chart"

// 날짜 데이터 인터페이스
export interface DateBasedData {
  date: Date
  value: number
  category?: string
}

/**
 * 원본 데이터를 시간별로 집계하는 함수 (일간 뷰)
 */
export function aggregateByHour(data: DateBasedData[]): ChartData[] {
  // 24시간에 대한 빈 배열 초기화
  const hourlyData: number[] = Array(24).fill(0)

  // 각 데이터 포인트를 해당 시간에 추가
  data.forEach((item) => {
    const hour = item.date.getHours()
    hourlyData[hour] += item.value
  })

  // ChartData 형식으로 변환
  return hourlyData.map((value, index) => ({
    x: index, // 0-23 시간
    y: value,
    label: `${index}시`,
  }))
}

/**
 * 원본 데이터를 일별로 집계하는 함수 (주간 뷰)
 */
export function aggregateByDay(data: DateBasedData[], days = 7): ChartData[] {
  // 지정된 일수에 대한 빈 배열 초기화
  const dailyData: number[] = Array(days).fill(0)
  const labels: string[] = []

  // 현재 날짜 기준으로 시작일 계산
  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - days + 1)
  startDate.setHours(0, 0, 0, 0)

  // 날짜 라벨 생성
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    labels.push(`${date.getMonth() + 1}/${date.getDate()}`)
  }

  // 각 데이터 포인트를 해당 일자에 추가
  data.forEach((item) => {
    const itemDate = new Date(item.date)
    const diffTime = itemDate.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 0 && diffDays < days) {
      dailyData[diffDays] += item.value
    }
  })

  // ChartData 형식으로 변환
  return dailyData.map((value, index) => ({
    x: index + 1,
    y: value,
    label: labels[index],
  }))
}

/**
 * 원본 데이터를 주별로 집계하는 함수 (월간 뷰)
 */
export function aggregateByWeek(data: DateBasedData[], weeks = 4): ChartData[] {
  // 지정된 주수에 대한 빈 배열 초기화
  const weeklyData: number[] = Array(weeks).fill(0)

  // 현재 날짜 기준으로 시작일 계산
  const today = new Date()
  const startDate = new Date()
  startDate.setDate(today.getDate() - weeks * 7 + 1)
  startDate.setHours(0, 0, 0, 0)

  // 각 데이터 포인트를 해당 주에 추가
  data.forEach((item) => {
    const itemDate = new Date(item.date)
    const diffTime = itemDate.getTime() - startDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weekIndex = Math.floor(diffDays / 7)

    if (weekIndex >= 0 && weekIndex < weeks) {
      weeklyData[weekIndex] += item.value
    }
  })

  // ChartData 형식으로 변환
  return weeklyData.map((value, index) => {
    const weekStart = new Date(startDate)
    weekStart.setDate(startDate.getDate() + index * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    return {
      x: index + 1,
      y: value,
      label: `${weekStart.getMonth() + 1}/${weekStart.getDate()}-${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`,
    }
  })
}

/**
 * 원본 데이터를 월별로 집계하는 함수 (연간 뷰)
 */
export function aggregateByMonth(data: DateBasedData[], months = 12): ChartData[] {
  // 지정된 월수에 대한 빈 배열 초기화
  const monthlyData: number[] = Array(months).fill(0)

  // 현재 날짜 기준으로 시작월 계산
  const today = new Date()
  const startMonth = today.getMonth() - months + 1
  const startYear = today.getFullYear() + Math.floor(startMonth / 12)
  const normalizedStartMonth = ((startMonth % 12) + 12) % 12 // 음수 처리

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  // 각 데이터 포인트를 해당 월에 추가
  data.forEach((item) => {
    const itemDate = new Date(item.date)
    const itemYear = itemDate.getFullYear()
    const itemMonth = itemDate.getMonth()

    // 시작 연월부터의 상대적 월 인덱스 계산
    const yearDiff = itemYear - startYear
    const monthDiff = itemMonth - normalizedStartMonth + yearDiff * 12

    if (monthDiff >= 0 && monthDiff < months) {
      monthlyData[monthDiff] += item.value
    }
  })

  // ChartData 형식으로 변환
  return monthlyData.map((value, index) => {
    const monthIndex = (normalizedStartMonth + index) % 12
    return {
      x: index + 1,
      y: value,
      label: monthNames[monthIndex],
    }
  })
}

/**
 * 원본 데이터를 카테고리별로 집계하는 함수 (원형 차트용)
 */
export function aggregateByCategory(data: DateBasedData[], colorMap: Record<string, string> = {}): PieChartData[] {
  const categoryMap = new Map<string, number>()

  // 각 데이터 포인트를 카테고리별로 집계
  data.forEach((item) => {
    if (item.category) {
      const currentValue = categoryMap.get(item.category) || 0
      categoryMap.set(item.category, currentValue + item.value)
    }
  })

  // 기본 색상 맵
  const defaultColors = [
    "#4CAF50",
    "#2196F3",
    "#FFC107",
    "#F44336",
    "#9C27B0",
    "#00BCD4",
    "#FF9800",
    "#795548",
    "#607D8B",
    "#E91E63",
    "#3F51B5",
    "#009688",
  ]

  // PieChartData 형식으로 변환
  let colorIndex = 0
  return Array.from(categoryMap.entries()).map(([category, value]) => {
    const color = colorMap[category] || defaultColors[colorIndex % defaultColors.length]
    colorIndex++
    return {
      label: category,
      value,
      color,
    }
  })
}

/**
 * 시간 범위에 따라 적절한 집계 함수를 선택하여 데이터 처리
 */
export function processDataByTimeRange(
  rawData: DateBasedData[],
  timeRange: string,
  categoryColorMap: Record<string, string> = {},
): StatisticsData {
  let barData: ChartData[] = []
  let lineData: ChartData[] = []
  let pieData: PieChartData[] = []

  switch (timeRange) {
    case "day":
      // 일간 뷰: 시간별 집계
      barData = aggregateByHour(rawData)
      lineData = aggregateByHour(rawData)
      break
    case "week":
      // 주간 뷰: 일별 집계
      barData = aggregateByDay(rawData, 7)
      lineData = aggregateByHour(rawData)
      break
    case "month":
      // 월간 뷰: 일별 집계 (최대 31일)
      barData = aggregateByDay(rawData, 31)
      lineData = aggregateByWeek(rawData, 4)
      break
    case "year":
      // 연간 뷰: 월별 집계
      barData = aggregateByMonth(rawData, 12)
      lineData = aggregateByMonth(rawData, 12)
      break
    default:
      // 기본값: 일별 집계
      barData = aggregateByDay(rawData, 7)
      lineData = aggregateByHour(rawData)
  }

  // 카테고리별 집계 (원형 차트용)
  pieData = aggregateByCategory(rawData, categoryColorMap)

  return {
    barChartData: barData,
    lineChartData: lineData,
    pieChartData: pieData,
  }
}

/**
 * API 응답 데이터를 DateBasedData 형식으로 변환
 */
export function convertApiDataToDateBased(
  apiData: any[],
  dateField = "date",
  valueField = "value",
  categoryField?: string,
): DateBasedData[] {
  return apiData.map((item) => ({
    date: new Date(item[dateField]),
    value: Number(item[valueField]),
    category: categoryField ? item[categoryField] : undefined,
  }))
}

/**
 * 테스트용 샘플 데이터 생성 함수
 */
export function generateSampleDateData(days = 100): DateBasedData[] {
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
