"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export function TransactionDateFilter() {
  const [startDate, setStartDate] = useState("2025-01-01")
  const [endDate, setEndDate] = useState("2025-01-31")

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="text-sm mr-2">조회기간</div>

      <div className="flex items-center">
        <div className="relative">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>

        <span className="mx-2">-</span>

        <div className="relative">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
          />
          <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
      </div>

      <div className="flex gap-1 ml-2">
        <Button variant="outline" size="sm" className="text-xs h-7 px-3">
          일일
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 px-3">
          1주일
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7 px-3">
          1개월
        </Button>
      </div>
    </div>
  )
}
