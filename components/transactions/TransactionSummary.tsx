"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { fetchTransactionSummary } from "@/services/transactionApi"
import { loadingStyles } from "@/lib/utils/style-utils"

interface TransactionSummaryProps {
  startDate: string
  endDate: string
  stationName: string
}

export function TransactionSummary({ startDate, endDate, stationName }: TransactionSummaryProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalDischargeAmount, setTotalDischargeAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  useEffect(() => {
    const loadSummary = async () => {
      // Don't load if no station is selected yet
      if (!stationName) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await fetchTransactionSummary(startDate, endDate, stationName)

        if (response.status === "success" && response.data) {
          // totalMeterValue is actually the discharge amount
          setTotalDischargeAmount(response.data.totalMeterValue)
          setTotalPrice(response.data.totalPrice)
        }
      } catch (error) {
        console.error("Error loading transaction summary:", error)
        // Set defaults on error
        setTotalDischargeAmount(0)
        setTotalPrice(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadSummary()
  }, [startDate, endDate, stationName])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* 총 수익 */}
      <Card className="bg-zinc-800 p-4 flex flex-col items-center justify-center">
        <span className="text-zinc-400 text-sm mb-1">총 수익</span>
        {isLoading ? (
          <div className={loadingStyles.smallSpinner}></div>
        ) : (
          <span className="text-2xl font-bold">{totalPrice.toLocaleString()} KRW</span>
        )}
      </Card>

      {/* ESS 방전량 */}
      <Card className="bg-zinc-800 p-4 flex flex-col items-center justify-center">
        <span className="text-zinc-400 text-sm mb-1">ESS 방전량</span>
        {isLoading ? (
          <div className={loadingStyles.smallSpinner}></div>
        ) : (
          <span className="text-2xl font-bold">{totalDischargeAmount.toLocaleString()} (Wh)</span>
        )}
      </Card>
    </div>
  )
}
