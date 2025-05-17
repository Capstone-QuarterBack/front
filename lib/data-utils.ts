import type { ChartData } from "@/types/chart"

export function generateChartData(): ChartData[] {
  return Array(24)
    .fill(0)
    .map((_, i) => ({
      x: i,
      y: Math.floor(Math.random() * 100) + 50,
    }))
}
