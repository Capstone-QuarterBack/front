"use client"

import { useEffect, useRef, useState } from "react"
import { Chart, registerables } from "chart.js"
import { formatNumber } from "@/lib/utils/number-utils"

Chart.register(...registerables)

interface RealtimeEnergyChartProps {
  chargerId: number
  stationId?: string
  isCharging: boolean
  initialPower?: number
}

// API 응답 타입 정의
interface PowerDataPoint {
  timestamp: string
  value: number
}

// 로컬 스토리지 키 생성 함수
const getStorageKey = (chargerId: number) => `charger_${chargerId}_data`

export function RealtimeEnergyChart({
  chargerId,
  stationId = "station-001",
  isCharging,
  initialPower = 10,
}: RealtimeEnergyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [currentPower, setCurrentPower] = useState<number>(initialPower)
  const [maxPower, setMaxPower] = useState<number>(initialPower)
  const [totalEnergy, setTotalEnergy] = useState<number>(0)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [dataPoints, setDataPoints] = useState<{ time: Date; power: number }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)
  const [apiCallCount, setApiCallCount] = useState<number>(0) // API 호출 횟수 추적

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 복원
  useEffect(() => {
    try {
      const storageKey = getStorageKey(chargerId)
      const savedData = localStorage.getItem(storageKey)

      if (savedData) {
        const parsedData = JSON.parse(savedData)

        // 저장된 데이터가 있으면 상태 복원
        if (parsedData.dataPoints && parsedData.dataPoints.length > 0) {
          // 시간 문자열을 Date 객체로 변환
          const restoredDataPoints = parsedData.dataPoints.map((point: any) => ({
            time: new Date(point.time),
            power: point.power,
          }))

          setDataPoints(restoredDataPoints)
          setCurrentPower(parsedData.currentPower || initialPower)
          setMaxPower(parsedData.maxPower || initialPower)
          setTotalEnergy(parsedData.totalEnergy || 0)
          setStartTime(new Date(parsedData.startTime || new Date()))

          console.log(`충전기 ${chargerId}의 데이터 복원 완료:`, restoredDataPoints.length, "개 데이터 포인트")
        }
      }
    } catch (error) {
      console.error("로컬 스토리지에서 데이터 복원 중 오류:", error)
    }
  }, [chargerId, initialPower])

  // 데이터 변경 시 로컬 스토리지에 저장
  useEffect(() => {
    if (dataPoints.length > 0) {
      try {
        const storageKey = getStorageKey(chargerId)
        const dataToSave = {
          dataPoints,
          currentPower,
          maxPower,
          totalEnergy,
          startTime: startTime.toISOString(),
        }

        localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      } catch (error) {
        console.error("로컬 스토리지에 데이터 저장 중 오류:", error)
      }
    }
  }, [dataPoints, currentPower, maxPower, totalEnergy, startTime, chargerId])

  // API에서 실시간 데이터 가져오기
  const fetchLiveData = async () => {
    if (!isCharging) return

    setIsLoading(true)
    setError(null)
    setApiCallCount((prev) => prev + 1) // API 호출 횟수 증가

    try {
      console.log(`API 호출 시도 #${apiCallCount + 1}: 충전기 ${chargerId}, 스테이션 ${stationId}`)

      // API 엔드포인트 URL
      const apiUrl = `http://localhost:8080/api/monitoring/live-streaming/${chargerId}/${stationId}`
      console.log(`API URL: ${apiUrl}`)

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Cache-Control": "no-cache",
        },
      })

      console.log(`API 응답 상태: ${response.status}`)

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`)
      }

      const apiData: PowerDataPoint[] = await response.json()
      console.log(`API 데이터 수신: ${apiData.length}개 데이터 포인트`, apiData)

      if (apiData && apiData.length > 0) {
        // API 데이터를 내부 형식으로 변환
        const newDataPoints = apiData.map((point) => ({
          time: new Date(point.timestamp),
          power: point.value,
        }))

        // 최신 데이터 포인트 가져오기
        const latestPoint = newDataPoints[newDataPoints.length - 1]

        // 현재 전력 업데이트
        setCurrentPower(latestPoint.power)

        // 최대 전력 업데이트
        const newMaxPower = Math.max(maxPower, ...newDataPoints.map((p) => p.power))
        setMaxPower(newMaxPower)

        // 총 에너지 계산 (kWh)
        // 이전 데이터 포인트와 현재 데이터 포인트 사이의 시간 차이를 계산하여 에너지 계산
        if (dataPoints.length > 0 && newDataPoints.length > 0) {
          const lastOldPoint = dataPoints[dataPoints.length - 1]
          const firstNewPoint = newDataPoints[0]

          // 시간 차이 계산 (시간 단위)
          const timeDiff = (firstNewPoint.time.getTime() - lastOldPoint.time.getTime()) / (1000 * 60 * 60)

          // 평균 전력 계산
          const avgPower = (lastOldPoint.power + firstNewPoint.power) / 2

          // 에너지 증가량 계산 (kWh = kW * 시간)
          const energyIncrement = avgPower * timeDiff

          // 총 에너지 업데이트
          setTotalEnergy((prev) => prev + energyIncrement)
        }

        // 데이터 포인트 업데이트 (기존 데이터와 병합)
        setDataPoints((prev) => {
          // 중복 제거를 위해 타임스탬프 기준으로 필터링
          const existingTimestamps = new Set(prev.map((p) => p.time.getTime()))
          const uniqueNewPoints = newDataPoints.filter((p) => !existingTimestamps.has(p.time.getTime()))

          console.log(`새로운 데이터 포인트: ${uniqueNewPoints.length}개`)

          // 새 데이터와 기존 데이터 병합 후 시간순 정렬
          const combined = [...prev, ...uniqueNewPoints].sort((a, b) => a.time.getTime() - b.time.getTime())

          // 최대 60개 데이터 포인트만 유지
          if (combined.length > 60) {
            return combined.slice(combined.length - 60)
          }
          return combined
        })

        // 마지막 fetch 시간 업데이트
        setLastFetchTime(new Date())
        console.log(`데이터 업데이트 완료: ${new Date().toLocaleTimeString()}`)
      } else {
        console.log("API에서 데이터를 받았지만 비어있습니다.")
      }
    } catch (error) {
      console.error("API 데이터 가져오기 실패:", error)
      setError(
        `데이터를 가져오는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      )

      // API 호출 실패 시 모의 데이터 생성 (백업)
      if (dataPoints.length > 0) {
        const lastPoint = dataPoints[dataPoints.length - 1]
        const now = new Date()

        // 이전 값에서 약간의 변동을 주어 새 값 생성
        const randomFactor = Math.random() * 0.1 - 0.05 // -5% ~ +5% 변동
        const newPower = Math.max(5, lastPoint.power * (1 + randomFactor))

        // 새 데이터 포인트 추가
        const newDataPoint = { time: now, power: newPower }

        setCurrentPower(newPower)
        setMaxPower(Math.max(maxPower, newPower))

        // 에너지 계산 (kWh)
        const timeDiff = (now.getTime() - lastPoint.time.getTime()) / (1000 * 60 * 60)
        const avgPower = (lastPoint.power + newPower) / 2
        const energyIncrement = avgPower * timeDiff

        setTotalEnergy((prev) => prev + energyIncrement)

        setDataPoints((prev) => {
          const newPoints = [...prev, newDataPoint].sort((a, b) => a.time.getTime() - b.time.getTime())
          if (newPoints.length > 60) {
            return newPoints.slice(newPoints.length - 60)
          }
          return newPoints
        })

        console.log("API 호출 실패로 모의 데이터 생성됨")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 차트 초기화 및 업데이트
  useEffect(() => {
    if (!chartRef.current || !isCharging) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // 기존 차트 인스턴스가 있으면 파괴
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // 차트 생성
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: dataPoints.map((point) => {
          const time = point.time
          return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
        }),
        datasets: [
          {
            label: "충전 전력 (kW)",
            data: dataPoints.map((point) => point.power),
            borderColor: "#10b981",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0, // 애니메이션 비활성화로 성능 향상
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kW`
              },
            },
          },
        },
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              color: "#9ca3af",
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
          y: {
            display: true,
            beginAtZero: true,
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
            },
            ticks: {
              color: "#9ca3af",
              callback: (value) => `${value} kW`,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [dataPoints, isCharging])

  // 실시간 데이터 폴링
  useEffect(() => {
    if (!isCharging) return

    console.log(`충전기 ${chargerId} 실시간 모니터링 시작`)

    // 초기 데이터 로드
    fetchLiveData()

    // 주기적으로 데이터 업데이트 (5초마다)
    const intervalId = setInterval(() => {
      console.log(`정기 업데이트 실행: ${new Date().toLocaleTimeString()}`)
      fetchLiveData()
    }, 5000) // 5초로 단축

    return () => {
      console.log(`충전기 ${chargerId} 실시간 모니터링 중지`)
      clearInterval(intervalId)
    }
  }, [isCharging, chargerId, stationId])

  // 차트 업데이트
  useEffect(() => {
    if (!chartInstance.current) return

    chartInstance.current.data.labels = dataPoints.map((point) => {
      const time = point.time
      return `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`
    })
    chartInstance.current.data.datasets[0].data = dataPoints.map((point) => point.power)
    chartInstance.current.update()
  }, [dataPoints])

  // 충전 중지 시 데이터 초기화 버튼
  const handleResetData = () => {
    // 로컬 스토리지에서 데이터 삭제
    localStorage.removeItem(getStorageKey(chargerId))

    // 상태 초기화
    setDataPoints([])
    setCurrentPower(initialPower)
    setMaxPower(initialPower)
    setTotalEnergy(0)
    setStartTime(new Date())
    setApiCallCount(0)

    console.log(`충전기 ${chargerId}의 데이터가 초기화되었습니다.`)
  }

  // 수동 새로고침 버튼 핸들러
  const handleManualRefresh = () => {
    console.log("수동 새로고침 요청")
    fetchLiveData()
  }

  // 충전 중이 아닌 경우 메시지 표시
  if (!isCharging) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-zinc-800 rounded-md text-gray-400">
        충전이 시작되면 실시간 그래프가 표시됩니다
      </div>
    )
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-white">실시간 충전 전력</h3>
        <div className="text-right">
          <p className="text-xs text-gray-400">
            현재: <span className="text-green-500 font-medium">{formatNumber(currentPower, 2)} kW</span>
          </p>
          <p className="text-xs text-gray-400">
            최대: <span className="text-blue-400 font-medium">{formatNumber(maxPower, 2)} kW</span>
          </p>
        </div>
      </div>

      {error ? (
        <div className="h-[150px] flex items-center justify-center text-red-500 text-sm bg-zinc-800 rounded">
          <p>{error}</p>
        </div>
      ) : (
        <div className="h-[150px] mb-2 relative">
          <canvas ref={chartRef} />
          {isLoading && (
            <div className="absolute top-2 right-2">
              <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
        <div>
          <p>
            총 충전량: <span className="text-green-500 font-medium">{formatNumber(totalEnergy, 3)} kWh</span>
          </p>
          {lastFetchTime && (
            <p className="text-xs text-gray-500">
              마지막 업데이트: {lastFetchTime.toLocaleTimeString()} (API 호출: {apiCallCount}회)
            </p>
          )}
        </div>
        <div className="flex items-center">
          <p className="mr-3">충전기 ID: {chargerId}</p>
          <button
            onClick={handleManualRefresh}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
            disabled={isLoading}
          >
            {isLoading ? "로딩중..." : "새로고침"}
          </button>
          <button
            onClick={handleResetData}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-gray-300 px-2 py-1 rounded"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}
