"use client"

import { useState, useEffect } from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { LineChart } from "@/components/charts/LineChart"
import { fetchDischargeByHour, type DischargeByHourData } from "@/services/api"
import type { ChartData } from "@/types/chart"
import { COLORS } from "@/lib/constants/theme"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"

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
      console.log("HourlyGeneration: 데이터 로드 시작")
      setIsLoading(true)
      setError(null)

      const data = await fetchDischargeByHour()
      console.log("HourlyGeneration: 받은 데이터:", data)

      if (!data || data.length === 0) {
        throw new Error("데이터가 비어 있습니다.")
      }

      // API 응답 데이터를 차트 데이터 형식으로 변환
      const formattedData: ChartData[] = data.map((item: DischargeByHourData) => ({
        x: item.hour,
        y: item.dischargeKwh / 1000, // kWh 단위로 변환 (값이 너무 크면 스케일 조정)
      }))

      console.log("HourlyGeneration: 변환된 차트 데이터:", formattedData)
      setChartData(formattedData)
    } catch (err) {
      console.error("HourlyGeneration: 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
      console.log("HourlyGeneration: 데이터 로드 완료")
    }
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("HourlyGeneration: 컴포넌트 마운트, 데이터 로드 시작")
    loadData()

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      console.log(`HourlyGeneration: ${refreshInterval}ms 간격으로 자동 새로고침 설정`)
      intervalId = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (intervalId) {
        console.log("HourlyGeneration: 자동 새로고침 정리")
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval])

  return (
    <CustomCard title="시간대별 발전량" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : (
          <LineChart data={chartData} color={COLORS.primary} />
        )}
      </div>
    </CustomCard>
  )
}
