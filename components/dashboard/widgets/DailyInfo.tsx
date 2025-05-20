"use client"

import { useState, useEffect } from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { fetchDailySummary, type DailySummaryData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { formatNumber } from "@/lib/utils/number-utils"

interface DailyInfoProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function DailyInfo({ className = "", refreshInterval = 0 }: DailyInfoProps) {
  const [data, setData] = useState<DailySummaryData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      console.log("DailyInfo: 데이터 로드 시작")
      setIsLoading(true)
      setError(null)

      const summaryData = await fetchDailySummary()
      console.log("DailyInfo: 받은 데이터:", summaryData)

      if (!summaryData) {
        throw new Error("데이터가 비어 있습니다.")
      }

      setData(summaryData)
    } catch (err) {
      console.error("DailyInfo: 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
      console.log("DailyInfo: 데이터 로드 완료")
    }
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("DailyInfo: 컴포넌트 마운트, 데이터 로드 시작")
    loadData()

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      console.log(`DailyInfo: ${refreshInterval}ms 간격으로 자동 새로고침 설정`)
      intervalId = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (intervalId) {
        console.log("DailyInfo: 자동 새로고침 정리")
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval])

  return (
    <CustomCard title="일일 정보" className={className}>
      <div className="relative space-y-4">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : data ? (
          <>
            <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
              <span className="text-zinc-400">Usage</span>
              <span className="font-medium">{data.usage}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
              <span className="text-amber-500">Profit</span>
              <span className="text-amber-500 font-medium">{formatNumber(data.profit)} KRW</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
              <span className="text-teal-500">Discharge</span>
              <span className="text-teal-500 font-medium">{formatNumber(data.discharge)} Wh</span>
            </div>
          </>
        ) : null}
      </div>
    </CustomCard>
  )
}
