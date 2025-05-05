"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { DataTable } from "@/components/ui/DataTable"
import { fetchChargerUsage, type ChargerUsageData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { formatDate } from "@/lib/utils/date-utils"

interface ChargerUsageProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function ChargerUsage({ className = "", refreshInterval = 0 }: ChargerUsageProps) {
  const [data, setData] = useState<ChargerUsageData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const columns = [
    {
      header: "시간대별",
      accessor: "timestamp",
      cellRenderer: (value: string) => formatDate(value),
    },
    {
      header: "충전기 위치",
      accessor: "chargerLocation",
    },
    {
      header: "충전기 모델",
      accessor: "chargerNumber",
    },
    {
      header: "사용량",
      accessor: "usage",
    },
    {
      header: "거래",
      accessor: "price",
    },
    {
      header: "확인 상태",
      accessor: "transactionId",
    },
  ]

  // 데이터 로드 함수
  const loadData = async () => {
    try {
      console.log("ChargerUsage: 데이터 로드 시작")
      setIsLoading(true)
      setError(null)

      const chargerData = await fetchChargerUsage()
      console.log("ChargerUsage: 받은 데이터:", chargerData)

      if (!chargerData || chargerData.length === 0) {
        throw new Error("데이터가 비어 있습니다.")
      }

      setData(chargerData)
    } catch (err) {
      console.error("ChargerUsage: 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
      console.log("ChargerUsage: 데이터 로드 완료")
    }
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("ChargerUsage: 컴포넌트 마운트, 데이터 로드 시작")
    loadData()

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      console.log(`ChargerUsage: ${refreshInterval}ms 간격으로 자동 새로고침 설정`)
      intervalId = setInterval(loadData, refreshInterval)
    }

    return () => {
      if (intervalId) {
        console.log("ChargerUsage: 자동 새로고침 정리")
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval])

  return (
    <Card title="충전기 사용 정보" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : (
          <DataTable columns={columns} data={data} headerClassName="bg-zinc-800" />
        )}
      </div>
    </Card>
  )
}
