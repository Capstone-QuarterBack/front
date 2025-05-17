"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart } from "@/components/charts/BarChart"
import { LineChart } from "@/components/charts/LineChart"
import { PieChart } from "@/components/charts/PieChart"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Download } from "lucide-react"
import type { StatisticsData } from "@/types/chart"
import {
  fetchStatisticsSummary,
  fetchCostData,
  fetchChargingVolumeData,
  fetchChargingInfoData,
  fetchChargerStatusData,
  fetchPowerTradingData,
  fetchChargerUptimeData,
  fetchChargerFailureData,
  fetchRepairTimeData,
  fetchPowerTradingRevenueData,
  fetchPowerTradingPriceData,
  fetchPowerTradingVolumeData,
  exportStatisticsData,
  type StatisticsSummary,
  type ChargerUptimeData,
  type ChargerFailureData,
  type RepairTimeData,
  type PowerTradingRevenueData,
  type PowerTradingPriceData,
  type PowerTradingVolumeData,
} from "@/services/statisticsApi"

export default function StatisticsPage() {
  // 상태 관리
  const [timeRange, setTimeRange] = useState<string>("month")
  const [activeTab, setActiveTab] = useState<string>("bar")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 데이터 상태
  const [costData, setCostData] = useState<StatisticsData | null>(null)
  const [volumeData, setVolumeData] = useState<StatisticsData | null>(null)
  const [infoData, setInfoData] = useState<StatisticsData | null>(null)
  const [statusData, setStatusData] = useState<StatisticsData | null>(null)
  const [tradingData, setTradingData] = useState<StatisticsData | null>(null)
  const [summaryData, setSummaryData] = useState<StatisticsSummary | null>(null)
  const [uptimeData, setUptimeData] = useState<ChargerUptimeData | null>(null)
  const [failureData, setFailureData] = useState<ChargerFailureData | null>(null)
  const [repairTimeData, setRepairTimeData] = useState<RepairTimeData | null>(null)
  const [tradingRevenueData, setTradingRevenueData] = useState<PowerTradingRevenueData | null>(null)
  const [tradingPriceData, setTradingPriceData] = useState<PowerTradingPriceData | null>(null)
  const [tradingVolumeData, setTradingVolumeData] = useState<PowerTradingVolumeData | null>(null)

  // 데이터 로딩 함수
  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      // 병렬로 모든 데이터 요청
      const [
        costResult,
        volumeResult,
        infoResult,
        statusResult,
        tradingResult,
        summaryResult,
        uptimeResult,
        failureResult,
        repairTimeResult,
        tradingRevenueResult,
        tradingPriceResult,
        tradingVolumeResult,
      ] = await Promise.all([
        fetchCostData(activeTab, timeRange),
        fetchChargingVolumeData(activeTab, timeRange),
        fetchChargingInfoData(activeTab, timeRange),
        fetchChargerStatusData(activeTab, timeRange),
        fetchPowerTradingData(activeTab, timeRange),
        fetchStatisticsSummary(timeRange),
        fetchChargerUptimeData(timeRange),
        fetchChargerFailureData(timeRange),
        fetchRepairTimeData(timeRange),
        fetchPowerTradingRevenueData(timeRange),
        fetchPowerTradingPriceData(timeRange),
        fetchPowerTradingVolumeData(timeRange),
      ])

      // 상태 업데이트
      setCostData(costResult)
      setVolumeData(volumeResult)
      setInfoData(infoResult)
      setStatusData(statusResult)
      setTradingData(tradingResult)
      setSummaryData(summaryResult)
      setUptimeData(uptimeResult)
      setFailureData(failureResult)
      setRepairTimeData(repairTimeResult)
      setTradingRevenueData(tradingRevenueResult)
      setTradingPriceData(tradingPriceResult)
      setTradingVolumeData(tradingVolumeResult)
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.")
      console.error("데이터 로딩 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  // 데이터 내보내기 함수
  const handleExportData = (format: string) => {
    const exportUrl = exportStatisticsData(format, "all", timeRange)
    window.open(exportUrl, "_blank")
  }

  // 시간 범위나 활성 탭이 변경될 때 데이터 다시 로드
  useEffect(() => {
    loadData()
  }, [timeRange, activeTab])

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-9 w-16" />
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="h-80">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // 에러 표시
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadData} className="mt-4">
          다시 시도
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">통계 대시보드</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant={timeRange === "day" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("day")}>
              일간
            </Button>
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("week")}
            >
              주간
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("month")}
            >
              월간
            </Button>
            <Button
              variant={timeRange === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("year")}
            >
              연간
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleExportData("excel")}>
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar">막대 그래프</TabsTrigger>
          <TabsTrigger value="pie">원형 그래프</TabsTrigger>
          <TabsTrigger value="line">선 그래프</TabsTrigger>
        </TabsList>

        {/* 막대 그래프 섹션 */}
        <TabsContent value="bar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costData && (
              <Card>
                <CardHeader>
                  <CardTitle>월별 충전 비용</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={costData.barChartData} color="#4CAF50" />
                </CardContent>
              </Card>
            )}

            {volumeData && (
              <Card>
                <CardHeader>
                  <CardTitle>월별 충전량 (kWh)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={volumeData.barChartData} color="#2196F3" />
                </CardContent>
              </Card>
            )}

            {infoData && (
              <Card>
                <CardHeader>
                  <CardTitle>요일별 충전 횟수</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={infoData.barChartData} color="#FFC107" />
                </CardContent>
              </Card>
            )}

            {statusData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전기별 고장 횟수</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={statusData.barChartData} color="#F44336" />
                </CardContent>
              </Card>
            )}

            {tradingData && (
              <Card>
                <CardHeader>
                  <CardTitle>월별 전력 거래량</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={tradingData.barChartData} color="#9C27B0" />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 원형 그래프 섹션 */}
        <TabsContent value="pie" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전소별 비용 분포</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={costData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {volumeData && (
              <Card>
                <CardHeader>
                  <CardTitle>시간대별 충전량</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={volumeData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {infoData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전 결과 상태</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={infoData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {statusData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전기 상태 분포</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={statusData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {tradingData && (
              <Card>
                <CardHeader>
                  <CardTitle>전력 거래 유형</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={tradingData.pieChartData} />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 선 그래프 섹션 */}
        <TabsContent value="line" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {costData && (
              <Card>
                <CardHeader>
                  <CardTitle>일별 비용 추이</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={costData.lineChartData} color="#4CAF50" />
                </CardContent>
              </Card>
            )}

            {volumeData && (
              <Card>
                <CardHeader>
                  <CardTitle>시간별 충전량 (kWh)</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={volumeData.lineChartData} color="#2196F3" />
                </CardContent>
              </Card>
            )}

            {infoData && (
              <Card>
                <CardHeader>
                  <CardTitle>시간별 충전 횟수</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={infoData.lineChartData} color="#FFC107" />
                </CardContent>
              </Card>
            )}

            {statusData && (
              <Card>
                <CardHeader>
                  <CardTitle>월별 충전기 가동률</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={statusData.lineChartData} color="#F44336" />
                </CardContent>
              </Card>
            )}

            {tradingData && (
              <Card>
                <CardHeader>
                  <CardTitle>시간별 전력 거래량</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={tradingData.lineChartData} color="#9C27B0" />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {summaryData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">종합 통계</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">총 충전량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalChargingVolume.toLocaleString()} kWh</div>
                <p className="text-xs text-muted-foreground">
                  전월 대비 {summaryData.comparisonWithPrevious.volumeChangePercent > 0 ? "+" : ""}
                  {summaryData.comparisonWithPrevious.volumeChangePercent}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">총 충전 횟수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.totalChargingCount.toLocaleString()}회</div>
                <p className="text-xs text-muted-foreground">
                  전월 대비 {summaryData.comparisonWithPrevious.countChangePercent > 0 ? "+" : ""}
                  {summaryData.comparisonWithPrevious.countChangePercent}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩{summaryData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  전월 대비 {summaryData.comparisonWithPrevious.revenueChangePercent > 0 ? "+" : ""}
                  {summaryData.comparisonWithPrevious.revenueChangePercent}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">평균 충전 시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summaryData.averageChargingTime}분</div>
                <p className="text-xs text-muted-foreground">
                  전월 대비 {summaryData.comparisonWithPrevious.timeChangePercent > 0 ? "+" : ""}
                  {summaryData.comparisonWithPrevious.timeChangePercent}%
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 충전기 성능 분석 섹션 */}
      {uptimeData && failureData && repairTimeData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">충전기 성능 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>충전기 가동률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{uptimeData.overallUptime}%</div>
                    <p className="text-xs text-muted-foreground">
                      전월 대비 {uptimeData.changePercent > 0 ? "+" : ""}
                      {uptimeData.changePercent}%
                    </p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                    <span className="text-xl font-bold">{uptimeData.overallUptime}%</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {uptimeData.stationUptime.map((station, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{station.name}</span>
                      <span
                        className={`font-medium ${
                          station.uptime >= 97
                            ? "text-green-500"
                            : station.uptime >= 95
                              ? "text-amber-500"
                              : "text-red-500"
                        }`}
                      >
                        {station.uptime}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>충전기 고장 빈도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {failureData.chargerFailures.map((charger) => (
                    <div key={charger.id} className="flex justify-between items-center">
                      <span>{charger.name}</span>
                      <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{
                            width: `${Math.min(100, (charger.failureCount / 25) * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm">{charger.failureCount}회</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>평균 수리 시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{repairTimeData.averageRepairTime} 시간</div>
                <div className="space-y-4">
                  {repairTimeData.repairTimeByType.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.type}</span>
                      <span className="font-medium">{item.time} 시간</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 전력 거래 분석 섹션 */}
      {tradingRevenueData && tradingPriceData && tradingVolumeData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">전력 거래 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>전력 거래 수익</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500 mb-4">
                  ₩{tradingRevenueData.netRevenue.toLocaleString()}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>전력 판매 수익</span>
                    <span className="font-medium text-green-500">
                      ₩{tradingRevenueData.salesRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>전력 구매 비용</span>
                    <span className="font-medium text-red-500">
                      ₩{tradingRevenueData.purchaseCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>순 수익</span>
                    <span className="font-medium text-green-500">
                      ₩{tradingRevenueData.netRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>시간대별 전력 거래 가격</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tradingPriceData.priceByTimeSlot.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{slot.timeSlot}</span>
                      <span className="font-medium">₩{slot.price}/kWh</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">평균 거래 가격</span>
                      <span className="font-bold">₩{tradingPriceData.averagePrice}/kWh</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>전력 거래량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{tradingVolumeData.totalVolume.toLocaleString()} kWh</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>판매량</span>
                    <span className="font-medium">{tradingVolumeData.salesVolume.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>구매량</span>
                    <span className="font-medium">{tradingVolumeData.purchaseVolume.toLocaleString()} kWh</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>최대 거래일</span>
                      <span className="font-medium">
                        {tradingVolumeData.peakTradingDay.date} (
                        {tradingVolumeData.peakTradingDay.volume.toLocaleString()} kWh)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>최소 거래일</span>
                      <span className="font-medium">
                        {tradingVolumeData.lowestTradingDay.date} (
                        {tradingVolumeData.lowestTradingDay.volume.toLocaleString()} kWh)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
