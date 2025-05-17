"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface TransactionDateFilterProps {
  startDate: string
  endDate: string
  onDateChange: (startDate: string, endDate: string) => void
}

export function TransactionDateFilter({ startDate, endDate, onDateChange }: TransactionDateFilterProps) {
  const [localStartDate, setLocalStartDate] = useState(startDate)
  const [localEndDate, setLocalEndDate] = useState(endDate)

  // Update local state when props change
  useEffect(() => {
    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
  }, [startDate, endDate])

  // Apply date filter
  const applyDateFilter = () => {
    onDateChange(localStartDate, localEndDate)
  }

  // Quick date filters
  const setDailyFilter = () => {
    const today = new Date().toISOString().split("T")[0]
    setLocalStartDate(today)
    setLocalEndDate(today)
    onDateChange(today, today)
  }

  const setWeeklyFilter = () => {
    const today = new Date()
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(today.getDate() - 7)

    const endDate = today.toISOString().split("T")[0]
    const startDate = oneWeekAgo.toISOString().split("T")[0]

    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
    onDateChange(startDate, endDate)
  }

  const setMonthlyFilter = () => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const startDate = firstDayOfMonth.toISOString().split("T")[0]
    const endDate = lastDayOfMonth.toISOString().split("T")[0]

    setLocalStartDate(startDate)
    setLocalEndDate(endDate)
    onDateChange(startDate, endDate)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="text-sm mr-2">조회기간</div>

      <div className="flex items-center">
        <div className="relative">
          <input
            type="date"
            value={localStartDate}
            onChange={(e) => setLocalStartDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>

        <span className="mx-2">-</span>

        <div className="relative">
          <input
            type="date"
            value={localEndDate}
            onChange={(e) => setLocalEndDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
      </div>

      <Button className="h-7 px-3 ml-2" onClick={applyDateFilter}>
        적용
      </Button>

      <div className="flex gap-1 ml-2">
        <Button variant="outline" size="sm" className="text-xs h-7 px-3" onClick={setDailyFilter}>
          일일
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 px-3" onClick={setWeeklyFilter}>
          1주일
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 px-3" onClick={setMonthlyFilter}>
          1개월
        </Button>
      </div>
    </div>
  )
}
