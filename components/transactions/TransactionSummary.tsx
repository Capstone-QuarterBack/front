"use client"

import { useState, useEffect } from "react"
import { fetchTransactionSummary } from "@/services/transactionApi"
import { formatNumber } from "@/lib/utils/number-utils"

interface TransactionSummaryProps {
  startDate: string
  endDate: string
  stationName: string
}

export function TransactionSummary({ startDate, endDate, stationName }: TransactionSummaryProps) {
  const [summaryData, setSummaryData] = useState({
    totalMeterValue: 0,
    totalPrice: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true)
        const response = await fetchTransactionSummary(startDate, endDate, stationName)

        if (response.status === "success" && response.data) {
          setSummaryData({
            totalMeterValue: response.data.totalMeterValue,
            totalPrice: response.data.totalPrice,
          })
        }
      } catch (error) {
        console.error("Error loading summary:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [startDate, endDate, stationName])

  // For the third value (ESS방전량), we'll use a placeholder since it's not in the API
  // In a real application, you would fetch this from another API or calculate it
  const essDischargeAmount = 102501

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-zinc-800 rounded-lg p-4">
      <div className="flex flex-col items-center p-3">
        <div className="text-sm text-zinc-400 mb-2">총 수익</div>
        <div className="text-xl font-bold">
          {isLoading ? "로딩 중..." : `${formatNumber(summaryData.totalPrice)} (KRW)`}
        </div>
      </div>
      <div className="flex flex-col items-center p-3 border-l border-r border-zinc-700">
        <div className="text-sm text-zinc-400 mb-2">총 ESS충전량</div>
        <div className="text-xl font-bold">
          {isLoading ? "로딩 중..." : `${formatNumber(summaryData.totalMeterValue)} (KWh)`}
        </div>
      </div>
      <div className="flex flex-col items-center p-3">
        <div className="text-sm text-zinc-400 mb-2">총 ESS방전량</div>
        <div className="text-xl font-bold">{formatNumber(essDischargeAmount)} (KWh)</div>
      </div>
    </div>
  )
}
