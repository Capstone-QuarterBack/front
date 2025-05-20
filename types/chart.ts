export interface ChartData {
  x: number | string
  y: number
  label?: string
}

export interface PieChartData {
  label: string
  value: number
  color: string
}

export interface StatisticsData {
  barChartData: ChartData[]
  lineChartData: ChartData[]
  pieChartData: PieChartData[]
}

// ChartData 타입에 color 속성을 추가합니다
export interface ChartData {
  x: number
  y: number
  label?: string
  color?: string // color 속성 추가
}
