"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { TransactionSearch } from "@/components/transactions/TransactionSearch"
import { TransactionDateFilter } from "@/components/transactions/TransactionDateFilter"
import {
  fetchTransactionRecords,
  fetchTransactionById,
  fetchTransactionSummary,
  type TransactionRecord,
} from "@/services/transactionApi"
import { loadingStyles } from "@/lib/utils/style-utils"
import { AlertCircle, FileText, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OpenBookProps {
  stationName: string
  startDate: string
  endDate: string
  onDateChange: (startDate: string, endDate: string) => void
  onStationSelect: (station: string) => void
}

// Fixed page size for station name searches
const FIXED_PAGE_SIZE = 10

export function OpenBook({ stationName, startDate, endDate, onDateChange, onStationSelect }: OpenBookProps) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [noResults, setNoResults] = useState<boolean>(false)
  const [searchMode, setSearchMode] = useState<"station" | "approval">("station")
  const [approvalNumber, setApprovalNumber] = useState<string>("")
  const [totalDischargeAmount, setTotalDischargeAmount] = useState<number>(0)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [pagination, setPagination] = useState({
    page: 0,
    size: FIXED_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  })
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [lastSearchedStation, setLastSearchedStation] = useState<string>(stationName)
  const [lastSearchedApproval, setLastSearchedApproval] = useState<string>("")

  // Load transaction data
  useEffect(() => {
    const loadTransactions = async () => {
      if (!stationName && searchMode === "station") return

      try {
        setIsLoading(true)
        setError(null)
        setNoResults(false)
        setTransactions([])

        if (searchMode === "approval" && approvalNumber) {
          try {
            const response = await fetchTransactionById(approvalNumber)

            if (response.status === "success" && response.data) {
              setTransactions([response.data])
              setPagination({
                page: 0,
                size: 1,
                totalElements: 1,
                totalPages: 1,
              })
              setLastSearchedApproval(approvalNumber)
              setSearchQuery(`승인번호: ${approvalNumber}`)
            } else {
              setNoResults(true)
              setSearchQuery(`승인번호: ${approvalNumber} (결과 없음)`)
            }
          } catch (err) {
            console.error("Error searching by approval number:", err)
            setNoResults(true)
            setSearchQuery(`승인번호: ${approvalNumber} (검색 실패)`)
          }
        } else {
          try {
            const stationToSearch = searchMode === "station" ? stationName : lastSearchedStation
            const response = await fetchTransactionRecords(
              startDate,
              endDate,
              stationToSearch,
              pagination.page,
              FIXED_PAGE_SIZE,
            )

            if (response.status === "success" && response.data) {
              if (response.data.content.length === 0) {
                setNoResults(true)
                setSearchQuery(`충전소: ${stationToSearch} (결과 없음)`)
              } else {
                setTransactions(response.data.content)
                setPagination({
                  page: response.data.page,
                  size: FIXED_PAGE_SIZE,
                  totalElements: response.data.totalElements,
                  totalPages: response.data.totalPages,
                })
                setLastSearchedStation(stationToSearch)
                setSearchQuery(`충전소: ${stationToSearch}`)
              }
            } else {
              setNoResults(true)
              setSearchQuery(`충전소: ${stationToSearch} (결과 없음)`)
            }
          } catch (err) {
            console.error("Error searching by station name:", err)
            setNoResults(true)
            setSearchQuery(`충전소: ${stationName} (검색 실패)`)
          }
        }

        // Load summary data
        try {
          const summaryResponse = await fetchTransactionSummary(
            startDate,
            endDate,
            searchMode === "station" ? stationName : lastSearchedStation,
          )
          if (summaryResponse.status === "success" && summaryResponse.data) {
            setTotalDischargeAmount(summaryResponse.data.totalMeterValue)
            setTotalPrice(summaryResponse.data.totalPrice)
          }
        } catch (err) {
          console.error("Error loading summary:", err)
        }
      } catch (err) {
        console.error("Error loading transactions:", err)
        setNoResults(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
  }, [stationName, startDate, endDate, searchMode, approvalNumber, pagination.page, lastSearchedStation])

  // Handle station name search
  const handleStationSearch = (name: string) => {
    if (name.trim()) {
      onStationSelect(name)
      setSearchMode("station")
      setApprovalNumber("")
      setPagination({
        page: 0,
        size: FIXED_PAGE_SIZE,
        totalElements: 0,
        totalPages: 1,
      })
    }
  }

  // Handle approval number search
  const handleApprovalSearch = (number: string) => {
    if (number.trim()) {
      setApprovalNumber(number)
      setSearchMode("approval")
      setPagination({
        page: 0,
        size: 1,
        totalElements: 0,
        totalPages: 1,
      })
    }
  }

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }))
  }

  // Reset search
  const handleResetSearch = () => {
    setSearchMode("station")
    setApprovalNumber("")
    onStationSelect(stationName)
    setPagination({
      page: 0,
      size: FIXED_PAGE_SIZE,
      totalElements: 0,
      totalPages: 1,
    })
  }

  // No results message component
  const NoResultsMessage = () => (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <AlertCircle className="h-12 w-12 text-amber-700 mb-4" />
      <h3 className="text-lg font-medium mb-2 text-amber-900">검색 결과가 없습니다</h3>
      <p className="text-amber-800 max-w-md mb-4">
        {searchMode === "approval"
          ? `승인번호 "${approvalNumber}"에 대한 검색 결과가 없습니다.`
          : `충전소 "${stationName}"에 대한 검색 결과가 없습니다.`}
      </p>
      <Button variant="outline" onClick={handleResetSearch} className="bg-amber-100 text-amber-900 border-amber-300">
        <RefreshCw className="mr-2 h-4 w-4" />
        검색 초기화
      </Button>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-5xl mx-auto"
    >
      {/* Book cover */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Book title */}
        <div className="bg-amber-900 p-4 text-center border-b border-amber-600">
          <h2 className="text-2xl font-bold text-white">{stationName} 충전소 거래내역</h2>
        </div>

        {/* Book pages */}
        <div className="bg-[#f5f0e0] p-6 min-h-[600px] relative">
          {/* Page texture overlay */}
          <div className="absolute inset-0 bg-[url('/placeholder-1zjvx.png')] opacity-10 pointer-events-none"></div>

          {/* Book content */}
          <div className="relative z-10">
            {/* Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#f8f5e8] rounded-lg shadow-md p-4 border border-amber-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-amber-900 font-medium text-lg">총 수익</h3>
                  <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-amber-900 font-bold">₩</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-amber-900 mt-2">
                  {isLoading ? "로딩 중..." : `${totalPrice.toLocaleString()} KRW`}
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-[#f8f5e8] rounded-lg shadow-md p-4 border border-amber-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-amber-900 font-medium text-lg">ESS 방전량</h3>
                  <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-amber-900 font-bold">⚡</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-amber-900 mt-2">
                  {isLoading ? "로딩 중..." : `${totalDischargeAmount.toLocaleString()} kWh`}
                </p>
              </motion.div>
            </div>

            {/* Unified search and filter section */}
            <div className="bg-[#f8f5e8] rounded-lg shadow-md p-4 border border-amber-300 mb-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-amber-900 mb-3">검색</h3>
                  <TransactionSearch
                    onStationSearch={handleStationSearch}
                    onApprovalSearch={handleApprovalSearch}
                    currentStation={stationName}
                  />
                </div>
                <div className="border-t md:border-t-0 md:border-l border-amber-300 my-4 md:my-0 md:mx-4 md:h-24"></div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-amber-900 mb-3">날짜 필터</h3>
                  <TransactionDateFilter startDate={startDate} endDate={endDate} onDateChange={onDateChange} />
                </div>
              </div>
            </div>

            {/* Search status and add transaction button */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="text-amber-900 font-medium">
                  {searchQuery ? (
                    <>
                      <span className="text-amber-600">검색:</span> {searchQuery}
                    </>
                  ) : (
                    "모든 거래내역"
                  )}
                </span>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetSearch}
                    className="ml-2 h-8 text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    초기화
                  </Button>
                )}
              </div>
              <Button className="bg-amber-700 hover:bg-amber-800 text-white">
                <FileText className="mr-2 h-4 w-4" />
                내역 추가
              </Button>
            </div>

            {/* Transaction results */}
            <div className="bg-[#f8f5e8] rounded-lg shadow-md border border-amber-300 overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className={loadingStyles.spinner}></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-800 p-4 rounded-md m-4">
                  <AlertCircle className="inline-block mr-2" />
                  {error}
                </div>
              ) : noResults ? (
                <NoResultsMessage />
              ) : (
                <TransactionTable transactions={transactions} pagination={pagination} onPageChange={handlePageChange} />
              )}
            </div>
          </div>
        </div>

        {/* Book binding */}
        <div className="h-4 bg-amber-900 rounded-b-lg"></div>
      </div>

      {/* Book shadow */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] h-4 bg-black/20 rounded-full blur-md"></div>
    </motion.div>
  )
}
