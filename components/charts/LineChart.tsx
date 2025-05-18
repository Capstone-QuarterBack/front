"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, registerables, type TooltipItem } from "chart.js"
import type { ChartData } from "@/types/chart"

Chart.register(...registerables)

interface LineChartProps {
  data: ChartData[]
  color?: string
  yAxisUnit?: string
}

export function LineChart({ data, color = "#2196F3", yAxisUnit = "" }: LineChartProps) {
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
    const labels = data.map((item) => {
      // 시간 레이블 유지 (예: "9시", "10시" 등)
      if (item.label) return item.label
      if (typeof item.x === "number") return `${item.x}시`
      return item.x
    })
    const values = data.map((item) => item.y)

    // 차트 설정
    const config: ChartConfiguration = {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: yAxisUnit ? `값 (${yAxisUnit})` : "값",
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
              label: (context: TooltipItem<"line">) => {
                const label = context.dataset.label || "값"
                const labelText = label.includes(" ") ? label.split(" ")[0] : label
                return `${labelText}: ${context.parsed.y.toLocaleString()}${yAxisUnit}`
              },
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
              callback: (value) => {
                if (typeof value === "number") {
                  return `${value.toLocaleString()}${yAxisUnit}`
                }
                return value
              },
            },
            title: {
              display: !!yAxisUnit,
              text: yAxisUnit,
              color: "#888",
              font: {
                size: 12,
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
  }, [data, color, yAxisUnit])

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
