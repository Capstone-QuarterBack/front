"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { LineChart } from "@/components/charts/LineChart"
import { fetchDischargeByHour, type DischargeByHourData } from "@/services/api"
import type { ChartData } from "@/types/chart"

export function HourlyGeneration() {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDischargeData() {
      try {
        setIsLoading(true)
        const data = await fetchDischargeByHour()

        // API 응답 데이터를 차트 데이터 형식으로 변환
        const formattedData: ChartData[] = data.map((item: DischargeByHourData) => ({
          x: item.hour,
          y: item.dischargeKwh / 1000, // kWh 단위로 변환 (값이 너무 크면 스케일 조정)
        }))

        setChartData(formattedData)
        setError(null)
      } catch (err) {
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadDischargeData()
  }, [])

  return (
    <Card title="시간대별 발전량" className="lg:col-span-2">
      <div className="h-[200px] relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-red-500">{error}</div>
        ) : (
          <LineChart data={chartData} color="#F59E0B" />
        )}
      </div>
    </Card>
  )
}
