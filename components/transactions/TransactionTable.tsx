"use client"

import { useState } from "react"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/date-utils"
import { formatNumber } from "@/lib/utils/number-utils"
import type { TransactionRecord } from "@/services/transactionApi"

interface TransactionTableProps {
  transactions: TransactionRecord[]
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
  onPageChange: (page: number) => void
}

export function TransactionTable({ transactions, pagination, onPageChange }: TransactionTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null

    return (
      <ChevronDown
        className={cn(
          "inline-block h-4 w-4 transition-transform",
          sortDirection === "desc" ? "transform rotate-180" : "",
        )}
      />
    )
  }

  // Calculate total values
  const totalMeterValue = transactions.reduce((sum, tx) => sum + tx.chargeSummary.totalMeterValue, 0)
  const totalPrice = transactions.reduce((sum, tx) => sum + tx.chargeSummary.totalPrice, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800 text-zinc-400 border-t border-b border-zinc-700">
          <tr>
            <th className="py-2 px-3 text-left font-normal">충전소</th>
            <th className="py-2 px-3 text-left font-normal">분류</th>
            <th className="py-2 px-3 text-left font-normal">구분</th>
            <th className="py-2 px-3 text-left font-normal cursor-pointer" onClick={() => handleSort("startTime")}>
              시작시간 {getSortIcon("startTime")}
            </th>
            <th className="py-2 px-3 text-left font-normal">완료시간</th>
            <th className="py-2 px-3 text-left font-normal">승인번호</th>
            <th className="py-2 px-3 text-left font-normal">사용자 정보</th>
            <th className="py-2 px-3 text-left font-normal">차량 정보</th>
            <th className="py-2 px-3 text-left font-normal">충전량</th>
            <th className="py-2 px-3 text-left font-normal">수익</th>
          </tr>
        </thead>
        <tbody>
          {/* 합계 행 */}
          <tr className="bg-zinc-800 border-b border-zinc-700">
            <td colSpan={8} className="py-2 px-3 text-right font-medium">
              합계
            </td>
            <td className="py-2 px-3">{formatNumber(totalMeterValue)}(KWh)</td>
            <td className="py-2 px-3">{formatNumber(totalPrice)} (KRW)</td>
          </tr>

          {/* 거래 데이터 행 */}
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-4 text-center text-zinc-400">
                거래 내역이 없습니다.
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.transactionId} className="border-b border-zinc-700 hover:bg-zinc-800">
                <td className="py-2 px-3">세종충전소</td>
                <td className="py-2 px-3">충전 내역</td>
                <td className="py-2 px-3">
                  <span>충전</span>
                </td>
                <td className="py-2 px-3">{formatDate(transaction.chargeSummary.startedTime)}</td>
                <td className="py-2 px-3">{formatDate(transaction.chargeSummary.endedTime)}</td>
                <td className="py-2 px-3">{transaction.transactionId}</td>
                <td className="py-2 px-3">{transaction.idToken}</td>
                <td className="py-2 px-3">{transaction.vehicleNo}</td>
                <td className="py-2 px-3">{formatNumber(transaction.chargeSummary.totalMeterValue)}(KWh)</td>
                <td className="py-2 px-3">{formatNumber(transaction.chargeSummary.totalPrice)} (KRW)</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center p-4">
          <button
            className="p-1 rounded-md bg-zinc-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="mx-4">
            페이지 {pagination.page + 1} / {pagination.totalPages}
          </div>

          <button
            className="p-1 rounded-md bg-zinc-800 text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
