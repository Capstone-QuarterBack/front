"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { OcppLogDetailModal } from "./OcppLogDetailModal"
import type { OcppMessage } from "@/services/ocppLogApi"
import { formatTimestamp } from "@/lib/utils/date-utils"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"

interface OcppLogTableProps {
  logs: OcppMessage[]
  pagination: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
  onPageChange: (page: number) => void
}

export function OcppLogTable({ logs, pagination, onPageChange }: OcppLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<OcppMessage | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [sortField, setSortField] = useState<string>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortField === "timestamp") {
      const dateA = new Date(a.timestamp).getTime()
      const dateB = new Date(b.timestamp).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    }

    if (sortField === "messageType") {
      return sortDirection === "asc" ? a.messageType - b.messageType : b.messageType - a.messageType
    }

    if (sortField === "action") {
      return sortDirection === "asc" ? a.action.localeCompare(b.action) : b.action.localeCompare(a.action)
    }

    if (sortField === "stationId") {
      return sortDirection === "asc" ? a.stationId.localeCompare(b.stationId) : b.stationId.localeCompare(a.stationId)
    }

    return 0
  })

  const handleViewDetails = (log: OcppMessage) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const getMessageTypeLabel = (type: number) => {
    switch (type) {
      case 2:
        return (
          <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800">
            Request
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-800">
            Response
          </Badge>
        )
      case 4:
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-800">
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div>
      <div className="rounded-md border border-zinc-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800">
            <TableRow>
              <TableHead className="w-40 cursor-pointer hover:bg-zinc-700" onClick={() => handleSort("timestamp")}>
                <div className="flex items-center">시간 {getSortIcon("timestamp")}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-zinc-700" onClick={() => handleSort("messageType")}>
                <div className="flex items-center">메시지 타입 {getSortIcon("messageType")}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-zinc-700" onClick={() => handleSort("action")}>
                <div className="flex items-center">액션 {getSortIcon("action")}</div>
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-zinc-700" onClick={() => handleSort("stationId")}>
                <div className="flex items-center">충전소 {getSortIcon("stationId")}</div>
              </TableHead>
              <TableHead>내용</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  로그 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sortedLogs.map((log, index) => (
                <TableRow
                  key={`${log.stationId}-${log.timestamp}-${index}`}
                  className="cursor-pointer hover:bg-zinc-800"
                  onClick={() => handleViewDetails(log)}
                >
                  <TableCell className="font-mono text-xs">{formatTimestamp(log.timestamp)}</TableCell>
                  <TableCell>{getMessageTypeLabel(log.messageType)}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.stationId}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.summary}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-zinc-400">
          총 {pagination.totalElements}개 항목 중 {pagination.page * pagination.size + 1}-
          {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}개 표시
        </div>

        <Pagination currentPage={pagination.page + 1} totalPages={pagination.totalPages} onPageChange={onPageChange} />
      </div>

      {selectedLog && (
        <OcppLogDetailModal log={selectedLog} isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} />
      )}
    </div>
  )
}
