"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// 모의 거래 데이터
const mockTransactions = [
  {
    id: 1,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "Tesla-102",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
  {
    id: 2,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "Ioniq6",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
  {
    id: 3,
    station: "세종충전소",
    category: "충전 내역",
    type: "오류",
    startTime: "2025-01-02 11:26:20",
    endTime: "2025-01-02 11:26:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "sm-1048",
    chargeAmount: "100,102(KWh)",
    revenue: "오류코드-1011",
  },
  {
    id: 4,
    station: "세종충전소",
    category: "충전 내역",
    type: "오류",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "오류코드-9651",
  },
  {
    id: 5,
    station: "세종충전소",
    category: "충전 내역",
    type: "오류",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "오류코드-1191",
  },
  {
    id: 6,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
  {
    id: 7,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
  {
    id: 8,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
  {
    id: 9,
    station: "세종충전소",
    category: "충전 내역",
    type: "충전",
    startTime: "2025-01-02 11:25:20",
    endTime: "2025-01-02 11:25:20",
    approvalNumber: "CSG-295710-CH",
    userCode: "USER-1042",
    vehicleInfo: "GV-60",
    chargeAmount: "100,102(KWh)",
    revenue: "12,360.7 (KRW)",
  },
]

// 합계 데이터
const totalData = {
  chargeAmount: "100,102(KWh)",
  revenue: "122,607.2 (KRW)",
}

export function TransactionTable() {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-zinc-800 text-zinc-400 border-t border-b border-zinc-700">
          <tr>
            <th className="py-2 px-3 text-left font-normal">충전소</th>
            <th className="py-2 px-3 text-left font-normal">분류</th>
            <th className="py-2 px-3 text-left font-normal cursor-pointer" onClick={() => handleSort("type")}>
              구분 {getSortIcon("type")}
            </th>
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
            <td className="py-2 px-3">{totalData.chargeAmount}</td>
            <td className="py-2 px-3">{totalData.revenue}</td>
          </tr>

          {/* 거래 데이터 행 */}
          {mockTransactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-zinc-700 hover:bg-zinc-800">
              <td className="py-2 px-3">{transaction.station}</td>
              <td className="py-2 px-3">{transaction.category}</td>
              <td className="py-2 px-3">
                <span className={transaction.type === "오류" ? "text-red-500" : ""}>{transaction.type}</span>
              </td>
              <td className="py-2 px-3">{transaction.startTime}</td>
              <td className="py-2 px-3">{transaction.endTime}</td>
              <td className="py-2 px-3">{transaction.approvalNumber}</td>
              <td className="py-2 px-3">{transaction.userCode}</td>
              <td className="py-2 px-3">{transaction.vehicleInfo}</td>
              <td className="py-2 px-3">{transaction.chargeAmount}</td>
              <td className="py-2 px-3">
                <span className={transaction.revenue.includes("오류코드") ? "text-red-500" : ""}>
                  {transaction.revenue}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
