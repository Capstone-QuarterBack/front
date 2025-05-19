"use client"

import { useEffect, useRef } from "react"
import { Chart, type ChartConfiguration, registerables, type TooltipItem } from "chart.js"
import type { ChartData } from "@/types/chart"

Chart.register(...registerables)

interface BarChartProps {
  data: ChartData[]
  color?: string
}

export function BarChart({ data, color = "#4CAF50" }: BarChartProps) {
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
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "값",
            data: values,
            backgroundColor: color,
            borderColor: color,
            borderWidth: 1,
            borderRadius: 4,
            barThickness: data.length > 20 ? "flex" : 30, // 데이터가 많으면 자동 조정
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
              label: (context: TooltipItem<"bar">) => `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`,
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
              maxRotation: 45, // 라벨이 많을 때 회전
              minRotation: 0,
              autoSkip: false, // 모든 라벨 표시
              font: {
                size: 10, // 폰트 크기 줄이기
              },
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
