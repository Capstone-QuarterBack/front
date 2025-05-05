"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { LineChart } from "@/components/charts/LineChart"
import { generateChartData } from "@/lib/data-utils"
import { COLORS } from "@/lib/constants/theme"

interface HourlyGenerationProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function HourlyGeneration({ className = "", refreshInterval = 0 }: HourlyGenerationProps) {
  const [chartData, setChartData] = useState(generateChartData())
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // 데이터 로드 함수 (실제 API 연동 전까지는 더미 데이터 사용)
  const loadData = async () => {
    try {
      setIsLoading(true)
      // 실제 API 연동 시 아래 주석 해제
      // const data = await fetchDischargeByHour()
      // setChartData(data.map(item => ({ x: item.hour, y: item.dischargeKwh / 1000 })))

      // 더미 데이터 생성
      setChartData(generateChartData())
    } catch (err) {
      console.error("데이터를 불러오는 중 오류가 발생했습니다:", err)
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
      <div className="relative w-full h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <LineChart data={chartData} color={COLORS.primary} />
        )}
      </div>
    </Card>
  )
}
