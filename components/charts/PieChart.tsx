"use client"

import { useEffect, useRef } from "react"
import type { PieChartData } from "@/types/chart"

interface PieChartProps {
  data: PieChartData[]
  width?: number
  height?: number
}

export function PieChart({ data, width = 300, height = 300 }: PieChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate total value for percentage
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // If total is 0, draw empty circle with message
    if (total === 0) {
      ctx.beginPath()
      ctx.arc(width / 2, height / 2, Math.min(width, height) / 2 - 40, 0, 2 * Math.PI)
      ctx.fillStyle = "#333"
      ctx.fill()

      ctx.fillStyle = "#fff"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("데이터 없음", width / 2, height / 2)
      return
    }

    // Draw pie chart
    let startAngle = 0
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 40

    // Draw slices
    data.forEach((item) => {
      const sliceAngle = (item.value / total) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      // Use specific colors for day/night if those labels are present
      let fillColor = item.color
      if (item.label === "주간") {
        fillColor = "#FFC107" // Yellow for daytime
      } else if (item.label === "야간") {
        fillColor = "#3F51B5" // Dark blue for nighttime
      }

      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = "white"
      ctx.stroke()

      // Draw slice label if slice is big enough
      const percentage = Math.round((item.value / total) * 100)
      if (percentage > 5) {
        const labelAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.7
        const labelX = centerX + Math.cos(labelAngle) * labelRadius
        const labelY = centerY + Math.sin(labelAngle) * labelRadius

        ctx.fillStyle = "#fff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${percentage}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw legend with station names
    const legendX = 10
    const legendY = height - data.length * 25 - 10 // Increased spacing for better readability
    const legendSpacing = 25 // Increased spacing between legend items

    data.forEach((item, index) => {
      const y = legendY + index * legendSpacing

      // Draw color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, y, 12, 12)

      // Format the value as currency
      const formattedValue = new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }).format(item.value)

      // Draw station name and value
      ctx.fillStyle = "#fff"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "left"
      ctx.textBaseline = "middle"

      // Truncate station name if too long
      let displayLabel = item.label
      if (displayLabel.length > 12) {
        displayLabel = displayLabel.substring(0, 10) + "..."
      }

      ctx.fillText(`${displayLabel} (${formattedValue})`, legendX + 18, y + 6)
    })
  }, [data, width, height])

  return (
    <div className="flex justify-center items-center h-full">
      <canvas ref={canvasRef} style={{ width: `${width}px`, height: `${height}px` }} className="max-w-full" />
    </div>
  )
}
