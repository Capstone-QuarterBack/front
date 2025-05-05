"use client"

import { useEffect, useRef } from "react"
import type { ChartData } from "@/types/chart"

interface LineChartProps {
  data: ChartData[]
  color: string
  className?: string
}

export function LineChart({ data, color, className = "" }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw chart
    const padding = 20
    const chartWidth = rect.width - padding * 2
    const chartHeight = rect.height - padding * 2

    // Find min and max values
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1 || 10 // 기본값 설정
    const minY = 0

    // Draw x and y axis
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    // Draw x-axis labels
    ctx.fillStyle = "#666"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    for (let i = 0; i < 24; i += 3) {
      const x = padding + (i / 23) * chartWidth
      ctx.fillText(i.toString(), x, rect.height - 5)
    }

    // Draw y-axis labels
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const y = rect.height - padding - (i / 5) * chartHeight
      const value = Math.round((i / 5) * maxY)
      ctx.fillText(value.toString(), padding - 5, y + 3)
    }

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (point.x / 23) * chartWidth
      const y = rect.height - padding - ((point.y - minY) / (maxY - minY)) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((point) => {
      const x = padding + (point.x / 23) * chartWidth
      const y = rect.height - padding - ((point.y - minY) / (maxY - minY)) * chartHeight

      if (point.y > 0) {
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 1
        ctx.stroke()
      }
    })
  }, [data, color])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
