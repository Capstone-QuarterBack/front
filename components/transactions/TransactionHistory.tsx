"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { TransactionSummary } from "@/components/transactions/TransactionSummary"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { TransactionSearch } from "@/components/transactions/TransactionSearch"
import { TransactionDateFilter } from "@/components/transactions/TransactionDateFilter"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  fetchTransactionRecords,
  fetchTransactionById,
  getCurrentMonthDateRange,
  type TransactionRecord,
} from "@/services/transactionApi"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { AlertCircle } from "lucide-react"

// Fixed page size for station name searches
const FIXED_PAGE_SIZE = 10

export default function TransactionHistory() {
  const [activeTab, setActiveTab] = useState<string>("충전 내역")
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)
  const [lastSearchTerm, setLastSearchTerm] = useState<string>("")
  const [pagination, setPagination] = useState({
    page: 0,
    size: FIXED_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  })

  // Get current month date range
  const { firstDate, secondDate } = getCurrentMonthDateRange()
  const [dateRange, setDateRange] = useState({
    startDate: firstDate,
    endDate: secondDate,
  })

  const [stationName, setStationName] = useState<string>("Sejong")
  const [searchMode, setSearchMode] = useState<"station" | "approval">("station")
  const [approvalNumber, setApprovalNumber] = useState<string>("")

  // Load transaction data
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        setNoResults(false)

        if (searchMode === "approval" && approvalNumber) {
          // Search by approval number
          setLastSearchTerm(approvalNumber)
          try {
            const response = await fetchTransactionById(approvalNumber)

            if (response.status === "success" && response.data) {
              // Convert single transaction to array format
              setTransactions([response.data])
              setPagination({
                page: 0,
                size: 1,
                totalElements: 1,
                totalPages: 1,
              })
            } else {
              setNoResults(true)
            }
          } catch (err) {
            console.error("Error searching by approval number:", err)
            setNoResults(true)
          }
        } else {
          // Search by station name and date range
          // Always use fixed page size for station name searches
          setLastSearchTerm(stationName)
          try {
            const response = await fetchTransactionRecords(
              dateRange.startDate,
              dateRange.endDate,
              stationName,
              pagination.page,
              FIXED_PAGE_SIZE, // Always use fixed page size
            )

            if (response.status === "success" && response.data) {
              if (response.data.content.length === 0) {
                setNoResults(true)
              } else {
                setTransactions(response.data.content)
                setPagination({
                  page: response.data.page,
                  size: FIXED_PAGE_SIZE, // Always use fixed page size
                  totalElements: response.data.totalElements,
                  totalPages: response.data.totalPages,
                })
              }
            } else {
              setNoResults(true)
            }
          } catch (err) {
            console.error("Error searching by station name:", err)
            setNoResults(true)
          }
        }
      } catch (err) {
        console.error("Error loading transactions:", err)
        setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [
    dateRange.startDate,
    dateRange.endDate,
    stationName,
    approvalNumber,
    searchMode,
    pagination.page, // Only page number affects the query, not size
  ])

  // Handle date range change
  const handleDateChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate })
    // Reset to first page when date range changes
    setPagination((prev) => ({ ...prev, page: 0 }))
  }

  // Handle station name search
  const handleStationSearch = (name: string) => {
    setStationName(name)
    setSearchMode("station")
    setApprovalNumber("")
    // Reset to first page when station changes and ensure fixed page size
    setPagination({
      page: 0,
      size: FIXED_PAGE_SIZE,
      totalElements: 0,
      totalPages: 1,
    })
  }

  // Handle approval number search
  const handleApprovalSearch = (number: string) => {
    setApprovalNumber(number)
    setSearchMode("approval")
    // Reset pagination for approval number search
    setPagination({
      page: 0,
      size: 1,
      totalElements: 0,
      totalPages: 1,
    })
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
      // Ensure size remains fixed at 10 for station searches
      size: searchMode === "station" ? FIXED_PAGE_SIZE : prev.size,
    }))
  }

  // No results message component
  const NoResultsMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
      <p className="text-zinc-400 max-w-md">
        {searchMode === "approval"
          ? `승인번호 "${lastSearchTerm}"에 대한 검색 결과가 없습니다.`
          : `충전소 "${lastSearchTerm}"에 대한 검색 결과가 없습니다.`}
      </p>
    </div>
  )

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="transactions" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <div className="mb-4">
            <h1 className="text-xl font-bold mb-4">충전소 거래내역</h1>

            {/* 날짜 필터 */}
            <TransactionDateFilter
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={handleDateChange}
            />

            {/* 요약 정보 */}
            <TransactionSummary startDate={dateRange.startDate} endDate={dateRange.endDate} stationName={stationName} />
          </div>

          {/* 탭 메뉴 */}
          <div className="mb-4">
            <Tabs defaultValue="충전 내역" className="w-full">
              <TabsList className="bg-zinc-800 border-b border-zinc-700 w-full justify-start h-auto p-0">
                <TabsTrigger
                  value="ESS 상태"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                  onClick={() => setActiveTab("ESS 상태")}
                >
                  ESS 상태
                </TabsTrigger>
                <TabsTrigger
                  value="충전 내역"
                  className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none"
                  onClick={() => setActiveTab("충전 내역")}
                >
                  충전 내역
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* 충전소 검색 및 거래 내역 테이블 */}
          <Card className="overflow-hidden">
            <div className="p-4">
              <TransactionSearch
                onStationSearch={handleStationSearch}
                onApprovalSearch={handleApprovalSearch}
                currentStation={stationName}
              />
            </div>

            {isLoading ? (
              <div className={loadingStyles.container}>
                <div className={loadingStyles.spinner}></div>
              </div>
            ) : error ? (
              <div className={errorStyles.container}>{error}</div>
            ) : noResults ? (
              <NoResultsMessage />
            ) : (
              <TransactionTable transactions={transactions} pagination={pagination} onPageChange={handlePageChange} />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
