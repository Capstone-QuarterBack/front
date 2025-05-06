"use client"

import { useState, useEffect } from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { fetchChargerUsage, type ChargerUsageData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"

interface ChargerUsageProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

export function ChargerUsage({ className = "", refreshInterval = 0 }: ChargerUsageProps) {
  const [data, setData] = useState<ChargerUsageData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
    <CustomCard title="충전기 사용 정보" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px]">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : (
          <div className="overflow-auto h-full bg-zinc-900">
            <table className="w-full text-sm">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">시간정보</th>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">충전기 위치</th>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">충전기 번호</th>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">사용량</th>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">가격</th>
                  <th className="py-2 px-3 text-left font-normal text-zinc-400">확인 번호</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-zinc-700">
                    <td className="py-3 px-3">{item.timestamp}</td>
                    <td className="py-3 px-3">{item.chargerLocation}</td>
                    <td className="py-3 px-3">{item.chargerNumber}</td>
                    <td className="py-3 px-3">{item.usage}</td>
                    <td className="py-3 px-3">{item.price}</td>
                    <td className="py-3 px-3">{item.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomCard>
  )
}
