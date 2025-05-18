export interface ChartData {
  x: number
  y: number
  label?: string // label을 선택적으로 변경
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
