export interface ChartData {
  x: number
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
