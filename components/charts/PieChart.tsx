"use client"

import { useEffect, useRef } from "react"
import type { PieChartData } from "@/types/chart"

interface PieChartProps {
  data: PieChartData[]
  width?: number
  height?: number
}

// 원형 그래프에서 단위 표시 개선을 위해 formatValue 함수를 추가합니다
// 이 함수는 라벨과 값을 기반으로 적절한 단위를 추가합니다
function formatValue(label: string, value: number): string {
  // 전기/전력 관련 데이터는 Wh 단위 사용
  if (
    label.includes("충전량") ||
    label.includes("방전량") ||
    label.includes("전력") ||
    label.includes("주간") ||
    label.includes("야간")
  ) {
    return `${value.toLocaleString()} Wh`
  }

  // 비용/요금 관련 데이터는 KRW 단위 사용
  else if (label.includes("비용") || label.includes("요금") || label.includes("수익") || label.includes("매출")) {
    return `${value.toLocaleString()} KRW`
  }

  // 충전 결과 분포는 % 단위 사용
  else if (label === "급속" || label === "완속") {
    return `${value.toLocaleString()}%`
  }

  // 충전기 상태 분포는 개 단위 사용
  else if (label === "정상" || label === "고장") {
    return `${value.toLocaleString()} 개`
  }

  // 개수 관련 데이터는 개 단위 사용
  else if (label.includes("횟수") || label.includes("개수") || label.includes("대수")) {
    return `${value.toLocaleString()} 개`
  }

  // 기본값은 단위 없이 숫자만 반환
  return value.toLocaleString()
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

      // 값 포맷팅 시 단위 추가
      let displayValue = formattedValue
      // 충전소별 비용 분포인 경우 KRW 단위 추가
      if (item.label.includes("충전소")) {
        displayValue = `${item.value.toLocaleString()} KRW`
      } else if (item.label === "주간" || item.label === "야간") {
        // 시간대별 충전량인 경우 Wh 단위 추가
        displayValue = `${item.value.toLocaleString()} Wh`
      } else if (item.label === "정상" || item.label === "고장") {
        // 충전기 상태 분포인 경우 개 단위 추가
        displayValue = `${item.value.toLocaleString()} 개`
      } else if (item.label === "급속" || item.label === "완속") {
        // 충전 결과 분포인 경우 % 단위 추가
        displayValue = `${item.value.toLocaleString()}%`
      }

      ctx.fillText(`${displayLabel} (${displayValue})`, legendX + 18, y + 6)
    })
  }, [data, width, height])

  return (
    <div className="flex justify-center items-center h-full">
      <canvas ref={canvasRef} style={{ width: `${width}px`, height: `${height}px` }} className="max-w-full" />
    </div>
  )
}
