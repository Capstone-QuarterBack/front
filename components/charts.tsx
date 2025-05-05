"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  x: number
  y: number
}

interface LineChartProps {
  data: ChartData[]
  color: string
}

export function LineChart({ data, color }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1
    const minY = 0

    // Draw x and y axis
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

    // Draw x-axis labels
    ctx.fillStyle = "#666"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    for (let i = 0; i < 24; i += 1) {
      if (i % 1 === 0) {
        const x = padding + (i / 23) * chartWidth
        ctx.fillText(i.toString(), x, rect.height - 5)
      }
    }

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    data.forEach((point, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth
      const y = rect.height - padding - ((point.y - minY) / (maxY - minY)) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()
  }, [data, color])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

export function BarChart({ data, color }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

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
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1
    const minY = 0

    // Draw bars
    const barWidth = (chartWidth / data.length) * 0.8
    const barSpacing = (chartWidth / data.length) * 0.2

    data.forEach((point, i) => {
      const x = padding + i * (barWidth + barSpacing)
      const barHeight = ((point.y - minY) / (maxY - minY)) * chartHeight
      const y = rect.height - padding - barHeight

      ctx.fillStyle = color
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw x-axis labels
    ctx.fillStyle = "#666"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    for (let i = 0; i < data.length; i += 4) {
      const x = padding + i * (barWidth + barSpacing) + barWidth / 2
      ctx.fillText(i.toString(), x, rect.height - 5)
    }
  }, [data, color])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
