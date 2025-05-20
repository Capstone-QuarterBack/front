"use client"

import { useState, useEffect, useCallback } from "react"
import { CustomCard } from "@/components/ui/CustomCard"
import { fetchChargerUsage, type ChargerUsageData } from "@/services/api"
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ChargerUsageProps {
  className?: string
  refreshInterval?: number // 자동 새로고침 간격 (밀리초)
}

interface PaginationResponse {
  usage: ChargerUsageData[]
  currentPage: number
  totalElements: number
  totalPages: number
}

export function ChargerUsage({ className = "", refreshInterval = 0 }: ChargerUsageProps) {
  const [data, setData] = useState<ChargerUsageData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalElements, setTotalElements] = useState<number>(0)
  const pageSize = 5

  // 데이터 로드 함수
  const loadData = useCallback(async (pageNum: number) => {
    try {
      console.log(`ChargerUsage: 페이지 ${pageNum} 데이터 로드 시작`)
      setIsLoading(true)
      setError(null)

      const response = (await fetchChargerUsage(pageNum, pageSize)) as PaginationResponse
      console.log("ChargerUsage: 받은 데이터:", response)

      if (!response.usage || response.usage.length === 0) {
        throw new Error("데이터가 비어 있습니다.")
      }

      setData(response.usage)
      setCurrentPage(response.currentPage)
      setTotalPages(response.totalPages)
      setTotalElements(response.totalElements)

      console.log(`ChargerUsage: 현재 페이지 ${response.currentPage}, 전체 페이지 ${response.totalPages}`)
    } catch (err) {
      console.error("ChargerUsage: 데이터 로드 오류:", err)
      setError(`데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`)
    } finally {
      setIsLoading(false)
      console.log(`ChargerUsage: 페이지 ${pageNum} 데이터 로드 완료`)
    }
  }, [])

  // 페이지 변경 핸들러
  const handlePageChange = (pageNum: number) => {
    if (pageNum < 0 || pageNum >= totalPages) return
    setCurrentPage(pageNum)
    loadData(pageNum)
  }

  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1)

    // 표시할 페이지 수가 maxVisiblePages보다 작을 경우 startPage 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // 초기 데이터 로드 및 자동 새로고침 설정
  useEffect(() => {
    console.log("ChargerUsage: 컴포넌트 마운트, 데이터 로드 시작")
    loadData(0)

    // 자동 새로고침 설정 (refreshInterval이 0보다 큰 경우에만)
    let intervalId: NodeJS.Timeout | null = null
    if (refreshInterval > 0) {
      console.log(`ChargerUsage: ${refreshInterval}ms 간격으로 자동 새로고침 설정`)
      intervalId = setInterval(() => {
        loadData(currentPage)
      }, refreshInterval)
    }

    return () => {
      if (intervalId) {
        console.log("ChargerUsage: 자동 새로고침 정리")
        clearInterval(intervalId)
      }
    }
  }, [refreshInterval, loadData])

  return (
    <CustomCard title="충전기 사용 정보" className={className}>
      <div className="relative h-[180px] md:h-[200px] lg:h-[220px] flex flex-col">
        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className={errorStyles.container}>{error}</div>
        ) : (
          <>
            <div className="overflow-auto flex-grow bg-zinc-900">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">시간정보</th>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">충전기 위치</th>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">충전기 번호</th>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">사용량</th>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">가격</th>
                    <th className="py-2 px-3 text-left font-normal text-zinc-400">확인 번호</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b border-zinc-700">
                      <td className="py-3 px-3">{item.timestamp}</td>
                      <td className="py-3 px-3">{item.chargerLocation}</td>
                      <td className="py-3 px-3">{item.chargerNumber}</td>
                      <td className="py-3 px-3">{item.usage}</td>
                      <td className="py-3 px-3">{item.price}</td>
                      <td className="py-3 px-3">{item.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 UI */}
            <div className="bg-zinc-800 border-t border-zinc-700 py-2 px-3 flex items-center justify-between text-xs">
              <div className="text-zinc-400">
                총 {totalElements}개 항목 중 {currentPage * pageSize + 1}-
                {Math.min((currentPage + 1) * pageSize, totalElements)}개 표시
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className={`p-1 rounded ${
                    currentPage === 0 ? "text-zinc-600 cursor-not-allowed" : "text-zinc-300 hover:bg-zinc-700"
                  }`}
                  aria-label="이전 페이지"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-2 py-1 rounded ${
                      pageNum === currentPage ? "bg-blue-600 text-white" : "text-zinc-300 hover:bg-zinc-700"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className={`p-1 rounded ${
                    currentPage >= totalPages - 1
                      ? "text-zinc-600 cursor-not-allowed"
                      : "text-zinc-300 hover:bg-zinc-700"
                  }`}
                  aria-label="다음 페이지"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </CustomCard>
  )
}
