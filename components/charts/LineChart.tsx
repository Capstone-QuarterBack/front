"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, registerables, type TooltipItem } from "chart.js"
import type { ChartData } from "@/types/chart"

Chart.register(...registerables)

interface LineChartProps {
  data: ChartData[]
  color?: string
}

export function LineChart({ data, color = "#2196F3" }: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // 기존 차트 인스턴스가 있으면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 데이터 준비
    const labels = data.map((item) => item.label || `항목 ${item.x + 1}`)
    const values = data.map((item) => item.y)

    // 차트 설정
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "값",
            data: values,
            borderColor: color,
            backgroundColor: `${color}33`, // 33은 20% 투명도
            borderWidth: 2,
            pointBackgroundColor: color,
            pointRadius: 3,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context: TooltipItem<"line">) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#888",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(200, 200, 200, 0.1)",
            },
            ticks: {
              color: "#888",
              callback: (value: number | string, index: number, ticks: unknown[]) => {
                if (typeof value === "number") {
                  return value.toLocaleString()
                }
                return value
              },
            },
          },
        },
      },
    }

    // 차트 생성
    chartInstance.current = new Chart(ctx, config)

    // 컴포넌트 언마운트 시 차트 정리
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, color])

  return (
    <div className="w-full h-full">
      {data && data.length > 0 ? (
        <canvas ref={chartRef} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">데이터가 없습니다</div>
      )}
    </div>
  )
}
