"use client"

import { useEffect, useRef, useState } from "react"
import type { ChartData } from "@/types/chart"
import { COLORS } from "@/lib/constants/theme"

interface ChartConfig {
  padding: number
  fontSize: string
  pointRadius: number
  xLabelStep: number
  yLabelCount: number
}

interface LineChartProps {
  data: ChartData[]
  color?: string
  showPoints?: boolean
  showLabels?: boolean
  className?: string
}

export function LineChart({
  data,
  color = COLORS.primary,
  showPoints = true,
  showLabels = true,
  className = "",
}: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // 화면 크기에 따른 차트 설정 계산
  const getChartConfig = (width: number): ChartConfig => {
    if (width < 400) {
      return {
        padding: 15,
        fontSize: "8px sans-serif",
        pointRadius: 3,
        xLabelStep: 4,
        yLabelCount: 3,
      }
    }

    return {
      padding: 20,
      fontSize: "10px sans-serif",
      pointRadius: 4,
      xLabelStep: 2,
      yLabelCount: 5,
    }
  }

  // 창 크기 변경 감지
  useEffect(() => {
    function handleResize() {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 차트 그리기
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0 || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 차트 설정 가져오기
    const config = getChartConfig(dimensions.width)

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw chart
    const { padding, fontSize, pointRadius, xLabelStep, yLabelCount } = config
    const chartWidth = dimensions.width - padding * 2
    const chartHeight = dimensions.height - padding * 2

    // Find min and max values
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1 || 10 // 기본값 설정
    const minY = 0

    // Draw x and y axis
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    if (showLabels) {
      // Draw x-axis labels
      ctx.fillStyle = "#666"
      ctx.font = fontSize
      ctx.textAlign = "center"

      for (let i = 0; i < 24; i += xLabelStep) {
        const x = padding + (i / 23) * chartWidth
        ctx.fillText(i.toString(), x, dimensions.height - 5)
      }

      // Draw y-axis labels
      ctx.textAlign = "right"
      for (let i = 0; i <= yLabelCount; i++) {
        const y = dimensions.height - padding - (i / yLabelCount) * chartHeight
        const value = Math.round((i / yLabelCount) * maxY)
        ctx.fillText(value.toString(), padding - 5, y + 3)
      }
    }

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (point.x / 23) * chartWidth
      const y = dimensions.height - padding - ((point.y - minY) / (maxY - minY)) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    if (showPoints) {
      data.forEach((point) => {
        const x = padding + (point.x / 23) * chartWidth
        const y = dimensions.height - padding - ((point.y - minY) / (maxY - minY)) * chartHeight

        if (point.y > 0) {
          ctx.beginPath()
          ctx.arc(x, y, pointRadius, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      })
    }
  }, [data, color, dimensions, showPoints, showLabels])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
