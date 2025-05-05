"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { LineChart } from "@/components/charts/LineChart"
import { fetchDischargeByHour, type DischargeByHourData } from "@/services/api"
import type { ChartData } from "@/types/chart"
import { COLORS } from "@/lib/constants/theme"

interface HourlyGenerationProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function HourlyGeneration({ className = "", refreshInterval = 0 }: HourlyGenerationProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await fetchDischargeByHour()

      // API 응답 데이터를 차트 데이터 형식으로 변환
      const formattedData: ChartData[] = data.map((item: DischargeByHourData) => ({
        x: item.hour,
        y: item.dischargeKwh / 1000, // kWh 단위로 변환 (값이 너무 크면 스케일 조정)
      }))

      setChartData(formattedData)
    } catch (err) {
      console.error("데이터 로드 오류:", err)
      setError("데이터를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    loadData()

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      intervalId = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [refreshInterval])

  return (
    <Card title="시간대별 발전량" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>
        ) : (
          <LineChart data={chartData} color={COLORS.primary} />
        )}
      </div>
    </Card>
  )
}
