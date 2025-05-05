"use client"

import { useEffect, useRef, useState } from "react"
import type { ChartData } from "@/types/chart"

interface LineChartProps {
  data: ChartData[]
  color: string
  className?: string
}

export function LineChart({ data, color, className = "" }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // 화면 크기에 따른 차트 설정 계산
  const getChartConfig = (width: number) => {
    if (width < 400) {
      return {
        padding: 15,
        fontSize: "8px sans-serif",
        pointRadius: 3,
        xLabelStep: 4,
      }
    }

    return {
      padding: 20,
      fontSize: "10px sans-serif",
      pointRadius: 4,
      xLabelStep: 2,
    }
  }

  // 창 크기 변경 감지 및 캔버스 크기 조정
  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    handleResize()

    // ResizeObserver를 사용하여 컨테이너 크기 변화 감지
    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // 윈도우 리사이즈 이벤트도 함께 처리
    window.addEventListener("resize", handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 차트 그리기
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || data.length === 0 || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Draw chart
    const config = getChartConfig(dimensions.width)
    const { padding, fontSize, pointRadius, xLabelStep } = config
    const chartWidth = dimensions.width - padding * 2
    const chartHeight = dimensions.height - padding * 2

    // Find min and max values
    const maxY = Math.max(...data.map((d) => d.y)) * 1.1 || 10 // 기본값 설정
    const minY = 0

    // Draw x and y axis
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1

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
    for (let i = 0; i <= 5; i++) {
      const y = dimensions.height - padding - (i / 5) * chartHeight
      const value = Math.round((i / 5) * maxY)
      ctx.fillText(value.toString(), padding - 5, y + 3)
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
  }, [data, color, dimensions])

  return (
    <div ref={containerRef} className={`w-full h-full aspect-[2/1] ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
