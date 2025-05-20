"use client"

import { useEffect, useState } from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { TradingPanel } from "@/components/dashboard/TradingPanel"
import { fetchKepcoPrice, fetchCsPrice, type KepcoPrice, type CsPrice } from "@/services/electricityPriceApi"

export function ElectricityTrading() {
  const [kepcoPrice, setKepcoPrice] = useState<KepcoPrice | null>(null)
  const [csPrices, setCsPrices] = useState<CsPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [kepcoData, csData] = await Promise.all([fetchKepcoPrice(), fetchCsPrice()])

        setKepcoPrice(kepcoData)
        setCsPrices(csData)
      } catch (error) {
        console.error("Error fetching electricity prices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 1분마다 데이터 갱신
    const intervalId = setInterval(fetchData, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // 가장 최근 CS 가격 데이터 가져오기
  const latestCsPrice = csPrices.length > 0 ? csPrices[0] : null

  const buyData = {
    title: "한국 전력 공사 (Wh)",
    amount: `₩ ${kepcoPrice ? kepcoPrice.kepcoPrice : "로딩 중..."}`,
    hideTimeList: true, // 날짜 정보 숨김
  }

  const sellData = {
    title: "세종 충전소",
    amount: `₩ ${latestCsPrice ? latestCsPrice.csPrice : "로딩 중..."}`,
    priceHistory: csPrices, // 전체 가격 이력 전달
    hideChangeRate: true, // 변동률 숨김
  }

  return (
    <CustomCard title="실시간 전기 거래 현황">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <TradingPanel data={buyData} aspectRatio={1.5} />
        <TradingPanel data={sellData} aspectRatio={1.5} showPriceHistory={true} />
      </div>
    </CustomCard>
  )
}
