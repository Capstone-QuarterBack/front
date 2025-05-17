"use client"

import { useState, useEffect } from "react"
import { OcppLogFilter } from "./OcppLogFilter"
import { OcppLogTable } from "./OcppLogTable"
import { fetchOcppLogs, type OcppMessage } from "@/services/ocppLogApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function OcppLogHistory() {
  // OcppMessage[] 타입을 명시적으로 지정
  const [logs, setLogs] = useState<OcppMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  })

  // 필터 상태의 타입을 string | undefined로 수정
  const [filters, setFilters] = useState({
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    messageType: undefined as string | undefined,
    direction: undefined as "incoming" | "outgoing" | undefined,
    stationId: undefined as string | undefined,
    chargerId: undefined as string | undefined,
  })

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetchOcppLogs(
        filters.startDate,
        filters.endDate,
        filters.messageType,
        filters.direction,
        filters.stationId,
        filters.chargerId,
        pagination.page,
        pagination.size,
      )

      setLogs(response.data.content)
      setPagination({
        page: response.data.page,
        size: response.data.size,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
      })
    } catch (err) {
      setError("로그를 불러오는 중 오류가 발생했습니다.")
      console.error("Error fetching logs:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [pagination.page, filters])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page - 1 })) // 페이지는 0부터 시작하므로 1을 빼줍니다.
  }

  const handleFilter = (
    startDate: string | undefined,
    endDate: string | undefined,
    messageType: string | undefined,
    direction: "incoming" | "outgoing" | undefined,
    stationId: string | undefined,
    chargerId: string | undefined,
  ) => {
    // 필터가 변경되면 페이지를 0으로 리셋
    setPagination((prev) => ({ ...prev, page: 0 }))
    setFilters({
      startDate,
      endDate,
      messageType,
      direction,
      stationId,
      chargerId,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OCPP 로그 내역</CardTitle>
      </CardHeader>
      <CardContent>
        <OcppLogFilter onFilter={handleFilter} />

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <OcppLogTable logs={logs} pagination={pagination} onPageChange={handlePageChange} />
        )}
      </CardContent>
    </Card>
  )
}
