export interface ChartData {
  x: number;
  y: number;
}

export interface PieChartData {
  label: string;
  value: number;
  color: string;
}

export interface StatisticsData {
  barChartData: ChartData[];
  lineChartData: ChartData[];
  pieChartData: PieChartData[];
}
