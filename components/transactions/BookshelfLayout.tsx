"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Book } from "@/components/ui/book"
import { OpenBook } from "@/components/transactions/OpenBook"
import { fetchChargingStationNames } from "@/services/stationApi"
import { loadingStyles } from "@/lib/utils/style-utils"

// Default date range for initial data load
const getDefaultDateRange = () => {
  return {
    startDate: "2025-01-01",
    endDate: "2026-06-06",
  }
}

// Book colors for variety
const BOOK_COLORS = ["bg-amber-700", "bg-amber-800", "bg-amber-900", "bg-amber-600", "bg-amber-700", "bg-amber-800"]

export function BookshelfLayout() {
  const [stationNames, setStationNames] = useState<string[]>([])
  const [selectedStation, setSelectedStation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { startDate, endDate } = getDefaultDateRange()
  const [currentDateRange, setCurrentDateRange] = useState({ startDate, endDate })

  // Load station names on component mount
  useEffect(() => {
    const loadStationNames = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetchChargingStationNames()
        if (response.status === "success" && response.data) {
          setStationNames(response.data)
          // Auto-select the first station
          if (response.data.length > 0 && !selectedStation) {
            setSelectedStation(response.data[0])
          }
        } else {
          setError("충전소 목록을 불러오는데 실패했습니다.")
        }
      } catch (err) {
        console.error("Error loading station names:", err)
        setError("충전소 목록을 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadStationNames()
  }, [])

  // Handle station selection
  const handleStationSelect = (stationName: string) => {
    setSelectedStation(stationName)
  }

  // Handle date range change
  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setCurrentDateRange({
      startDate: newStartDate,
      endDate: newEndDate,
    })
  }

  return (
    <div className="min-h-screen bg-[#f5f0e0] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-900 mb-8 text-center">충전소 거래내역</h1>

        {isLoading ? (
          <div className={loadingStyles.container}>
            <div className={loadingStyles.spinner}></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">{error}</div>
        ) : (
          <>
            {/* Bookshelf */}
            <div className="mb-12 relative">
              {/* Bookshelf top */}
              <div className="h-4 bg-amber-900 rounded-t-md"></div>

              {/* Books container */}
              <div className="bg-amber-800 p-8 rounded-b-md shadow-xl flex items-end justify-center gap-6 min-h-[180px]">
                {stationNames.length === 0 ? (
                  <p className="text-white text-center py-8">등록된 충전소가 없습니다.</p>
                ) : (
                  stationNames.map((name, index) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Book
                        title={name}
                        isSelected={selectedStation === name}
                        onClick={() => handleStationSelect(name)}
                        color={BOOK_COLORS[index % BOOK_COLORS.length]}
                      />
                    </motion.div>
                  ))
                )}
              </div>

              {/* Bookshelf shadow */}
              <div className="absolute -bottom-4 left-0 right-0 h-4 bg-black/20 blur-md"></div>
            </div>

            {/* Open book */}
            <AnimatePresence mode="wait">
              {selectedStation && (
                <OpenBook
                  key={selectedStation}
                  stationName={selectedStation}
                  startDate={currentDateRange.startDate}
                  endDate={currentDateRange.endDate}
                  onDateChange={handleDateChange}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}
