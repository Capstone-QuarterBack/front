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
  fetchTimeTypeMeterValueData,
  fetchStationPriceDistributionData,
  fetchChargingTypeData,
  fetchStationsOperatingRateData,
  exportStatisticsData,
  type StatisticsSummary,
  type ChargerUptimeData,
  type ChargerFailureData,
  type RepairTimeData,
  type PowerTradingRevenueData,
  type PowerTradingPriceData,
  type PowerTradingVolumeData,
} from "@/services/statisticsApi"
import { aggregateStatisticsData } from "@/lib/utils/chart-utils"

// filterLastSevenDays 함수를 완전히 다시 작성합니다.
// 기존 함수를 아래 코드로 교체해주세요:

function filterLastSevenDays(data: StatisticsData | null): StatisticsData | null {
  if (!data) {
    console.warn("No data provided to filterLastSevenDays")
    return data
  }

  console.log("Original data:", JSON.stringify(data))

  // 모든 데이터를 유지하되, 날짜 형식만 변환합니다
  const processBarData = data.barChartData.map((item, index) => {
    let formattedLabel = item.label

    // YYYY-MM-DD 형식의 날짜를 MM/DD 형식으로 변환
    if (item.label && item.label.includes("-") && item.label.length >= 10) {
      formattedLabel = item.label.substring(5, 10).replace("-", "/")
    }

    return {
      ...item,
      x: index, // 인덱스 재할당
      label: formattedLabel,
    }
  })

  const processLineData = data.lineChartData.map((item, index) => {
    let formattedLabel = item.label

    // YYYY-MM-DD 형식의 날짜를 MM/DD 형식으로 변환
    if (item.label && item.label.includes("-") && item.label.length >= 10) {
      formattedLabel = item.label.substring(5, 10).replace("-", "/")
    }

    return {
      ...item,
      x: index, // 인덱스 재할당
      label: formattedLabel,
    }
  })

  const result = {
    ...data,
    barChartData: processBarData,
    lineChartData: processLineData,
  }

  console.log("Processed data:", JSON.stringify(result))
  return result
}

// Add this helper function at the top of the file, after the imports
function translateTimeSlot(timeSlot: string): string {
  switch (timeSlot) {
    case "OFF_PEAK":
      return "심야 시간대 (23-06시)"
    case "MID_PEAK":
      return "일반 시간대 (06-10시, 17-23시)"
    case "ON_PEAK":
      return "최대 시간대 (10-17시)"
    default:
      return timeSlot
  }
}

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
  const [stationPriceData, setStationPriceData] = useState<StatisticsData | null>(null)
  const [chargingTypeData, setChargingTypeData] = useState<StatisticsData | null>(null)
  const [stationsOperatingRateData, setStationsOperatingRateData] = useState<StatisticsData | null>(null)

  // 집계된 데이터 상태
  const [aggregatedCostData, setAggregatedCostData] = useState<StatisticsData | null>(null)
  const [aggregatedVolumeData, setAggregatedVolumeData] = useState<StatisticsData | null>(null)
  const [aggregatedInfoData, setAggregatedInfoData] = useState<StatisticsData | null>(null)
  const [aggregatedStatusData, setAggregatedStatusData] = useState<StatisticsData | null>(null)
  const [aggregatedTradingData, setAggregatedTradingData] = useState<StatisticsData | null>(null)
  const [aggregatedOperatingRateData, setAggregatedOperatingRateData] = useState<StatisticsData | null>(null)

  // 시간 범위 매핑
  const timeRangeMapping: Record<string, string> = {
    day: "today",
    week: "lastweek",
    month: "lastmonth",
    year: "lastyear",
  }

  // For the time-based charging volume section:
  const [timeTypeMeterValueData, setTimeTypeMeterValueData] = useState<StatisticsData>({
    barChartData: [],
    lineChartData: [],
    pieChartData: [],
  })

  // 데이터 로딩 함수
  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const apiTimeRange = timeRangeMapping[timeRange] || timeRange

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
        stationPriceResult,
        chargingTypeResult,
        operatingRateResult,
      ] = await Promise.all([
        fetchCostData(activeTab, apiTimeRange),
        fetchChargingVolumeData(activeTab, apiTimeRange),
        fetchChargingInfoData(activeTab, apiTimeRange),
        fetchChargerStatusData(activeTab, apiTimeRange),
        fetchPowerTradingData(activeTab, apiTimeRange),
        fetchStatisticsSummary(apiTimeRange),
        fetchChargerUptimeData(apiTimeRange),
        fetchChargerFailureData(apiTimeRange),
        fetchRepairTimeData(apiTimeRange),
        fetchPowerTradingRevenueData(apiTimeRange),
        fetchPowerTradingPriceData(apiTimeRange),
        fetchPowerTradingVolumeData(apiTimeRange),
        fetchStationPriceDistributionData(),
        fetchChargingTypeData(apiTimeRange),
        fetchStationsOperatingRateData(activeTab, apiTimeRange),
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
      setStationPriceData(stationPriceResult)
      setChargingTypeData(chargingTypeResult)
      setStationsOperatingRateData(operatingRateResult)

      // 데이터 집계 및 필터링
      let processedCostData = aggregateStatisticsData(costResult, timeRange as "day" | "week" | "month" | "year")
      let processedVolumeData = aggregateStatisticsData(volumeResult, timeRange as "day" | "week" | "month" | "year")
      let processedInfoData = aggregateStatisticsData(infoResult, timeRange as "day" | "week" | "month" | "year")
      let processedStatusData = aggregateStatisticsData(statusResult, timeRange as "day" | "week" | "month" | "year")
      let processedTradingData = aggregateStatisticsData(tradingResult, timeRange as "day" | "week" | "month" | "year")
      let processedOperatingRateData = aggregateStatisticsData(
        operatingRateResult,
        timeRange as "day" | "week" | "month" | "year",
      )

      // 일간 데이터인 경우 최근 7일만 표시
      // 모든 데이터에 대해 날짜 형식 변환 적용
      processedCostData = filterLastSevenDays(processedCostData)
      processedVolumeData = filterLastSevenDays(processedVolumeData)
      processedInfoData = filterLastSevenDays(processedInfoData)
      processedStatusData = filterLastSevenDays(processedStatusData)
      processedTradingData = filterLastSevenDays(processedTradingData)
      processedOperatingRateData = filterLastSevenDays(processedOperatingRateData)

      setAggregatedCostData(processedCostData)
      setAggregatedVolumeData(processedVolumeData)
      setAggregatedInfoData(processedInfoData)
      setAggregatedStatusData(processedStatusData)
      setAggregatedTradingData(processedTradingData)
      setAggregatedOperatingRateData(processedOperatingRateData)
    } catch (err) {
      setError("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.")
      console.error("데이터 로딩 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  // 데이터 내보내기 함수
  const handleExportData = (format: string) => {
    const apiTimeRange = timeRangeMapping[timeRange] || timeRange
    const exportUrl = exportStatisticsData(format, "all", apiTimeRange)
    window.open(exportUrl, "_blank")
  }

  // Also update the useEffect to ensure we're properly handling the data for the daily view
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Keep the existing data loading code
        const apiTimeRange = timeRangeMapping[timeRange] || timeRange

        console.log(`Loading data with timeRange=${timeRange}, apiTimeRange=${apiTimeRange}, activeTab=${activeTab}`)

        // For power trading data, ensure we're getting the right chart type based on the active tab
        const tradingResult = await fetchPowerTradingData(activeTab, apiTimeRange)
        console.log("Power trading data loaded:", tradingResult)

        // 병렬로 모든 데이터 요청
        const [
          costResult,
          volumeResult,
          infoResult,
          statusResult,
          summaryResult,
          uptimeResult,
          failureResult,
          repairTimeResult,
          tradingRevenueResult,
          tradingPriceResult,
          tradingVolumeResult,
          stationPriceResult,
          chargingTypeResult,
          operatingRateResult,
        ] = await Promise.all([
          fetchCostData(activeTab, apiTimeRange),
          fetchChargingVolumeData(activeTab, apiTimeRange),
          fetchChargingInfoData(activeTab, apiTimeRange),
          fetchChargerStatusData(activeTab, apiTimeRange),
          fetchStatisticsSummary(apiTimeRange),
          fetchChargerUptimeData(apiTimeRange),
          fetchChargerFailureData(apiTimeRange),
          fetchRepairTimeData(apiTimeRange),
          fetchPowerTradingRevenueData(apiTimeRange),
          fetchPowerTradingPriceData(apiTimeRange),
          fetchPowerTradingVolumeData(apiTimeRange),
          fetchStationPriceDistributionData(),
          fetchChargingTypeData(apiTimeRange),
          fetchStationsOperatingRateData(activeTab, apiTimeRange),
        ])

        // 상태 업데이트
        setCostData(costResult)
        setVolumeData(volumeResult)
        setInfoData(infoResult)
        setStatusData(statusResult)
        setSummaryData(summaryResult)
        setUptimeData(uptimeResult)
        setFailureData(failureResult)
        setRepairTimeData(repairTimeResult)
        setTradingRevenueData(tradingRevenueResult)
        setTradingPriceData(tradingPriceResult)
        setTradingVolumeData(tradingVolumeResult)
        setStationPriceData(stationPriceResult)
        setChargingTypeData(chargingTypeResult)
        setStationsOperatingRateData(operatingRateResult)

        // 데이터 집계 및 필터링
        let processedCostData = aggregateStatisticsData(costResult, timeRange as "day" | "week" | "month" | "year")
        let processedVolumeData = aggregateStatisticsData(volumeResult, timeRange as "day" | "week" | "month" | "year")
        let processedInfoData = aggregateStatisticsData(infoResult, timeRange as "day" | "week" | "month" | "year")
        let processedStatusData = aggregateStatisticsData(statusResult, timeRange as "day" | "week" | "month" | "year")
        let processedOperatingRateData = aggregateStatisticsData(
          operatingRateResult,
          timeRange as "day" | "week" | "month" | "year",
        )

        // 일간 데이터인 경우 최근 7일만 표시
        // 모든 데이터에 대해 날짜 형식 변환 적용
        processedCostData = filterLastSevenDays(processedCostData)
        processedVolumeData = filterLastSevenDays(processedVolumeData)
        processedInfoData = filterLastSevenDays(processedInfoData)
        processedStatusData = filterLastSevenDays(processedStatusData)
        processedOperatingRateData = filterLastSevenDays(processedOperatingRateData)

        setAggregatedCostData(processedCostData)
        setAggregatedVolumeData(processedVolumeData)
        setAggregatedInfoData(processedInfoData)
        setAggregatedStatusData(processedStatusData)
        setAggregatedOperatingRateData(processedOperatingRateData)

        // Add this line to load the time-based meter value data
        const timeTypeData = await fetchTimeTypeMeterValueData()
        setTimeTypeMeterValueData(timeTypeData)

        // Process the trading data
        let processedTradingData = aggregateStatisticsData(
          tradingResult,
          timeRange as "day" | "week" | "month" | "year",
        )

        console.log("Processed trading data:", processedTradingData)

        // If we're in daily view, make sure we have data
        if (
          timeRange === "day" &&
          (!processedTradingData?.barChartData?.length || !processedTradingData?.lineChartData?.length)
        ) {
          console.log("No processed trading data for daily view, using mock data")
          // Use mock data if we don't have any
          processedTradingData = {
            barChartData: [
              { x: 0, y: 100, label: "05/16" },
              { x: 1, y: 100, label: "05/15" },
              { x: 2, y: 98, label: "05/14" },
              { x: 3, y: 97, label: "05/13" },
              { x: 4, y: 95, label: "05/12" },
              { x: 5, y: 90, label: "05/11" },
              { x: 6, y: 85, label: "05/10" },
            ],
            lineChartData: [
              { x: 0, y: 100, label: "05/16" },
              { x: 1, y: 100, label: "05/15" },
              { x: 2, y: 98, label: "05/14" },
              { x: 3, y: 97, label: "05/13" },
              { x: 4, y: 95, label: "05/12" },
              { x: 5, y: 90, label: "05/11" },
              { x: 6, y: 85, label: "05/10" },
            ],
            pieChartData: [],
          }
        }

        // Filter if needed
        // 항상 날짜 형식 변환 적용
        processedTradingData = filterLastSevenDays(processedTradingData)

        setAggregatedTradingData(processedTradingData)
      } catch (error) {
        setError("데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.")
        console.error("데이터 로딩 오류:", error)
      } finally {
        setLoading(false)
      }
    }

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
          {/* 원형 그래프 탭이 아닐 때만 시간 범위 버튼 표시 */}
          {activeTab !== "pie" && (
            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("day")}
              >
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
          )}
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
            {aggregatedCostData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전 비용
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={aggregatedCostData.barChartData} color="#4CAF50" />
                </CardContent>
              </Card>
            )}

            {aggregatedVolumeData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전량 (kWh)
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={aggregatedVolumeData.barChartData} color="#2196F3" />
                </CardContent>
              </Card>
            )}

            {aggregatedInfoData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전 횟수
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={aggregatedInfoData.barChartData} color="#FFC107" />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>
                  {timeRange === "day"
                    ? "일별"
                    : timeRange === "week"
                      ? "주별"
                      : timeRange === "month"
                        ? "월별"
                        : "연별"}{" "}
                  충전기별 고장 횟수
                </CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <BarChart data={aggregatedStatusData.barChartData} color="#F44336" />
              </CardContent>
            </Card>

            {aggregatedTradingData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    전력 거래량
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <BarChart data={aggregatedTradingData.barChartData} color="#9C27B0" />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 원형 그래프 섹션 */}
        <TabsContent value="pie" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stationPriceData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전소별 비용 분포</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={stationPriceData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {/* 시간대별 충전량 */}
            <Card className="col-span-1 row-span-1 bg-black text-white border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">시간대별 충전량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart data={timeTypeMeterValueData.pieChartData} width={300} height={300} />
                </div>
              </CardContent>
            </Card>

            {chargingTypeData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전 결과 분포</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={chargingTypeData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {aggregatedStatusData && (
              <Card>
                <CardHeader>
                  <CardTitle>충전기 상태 분포</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <PieChart data={aggregatedStatusData.pieChartData} />
                </CardContent>
              </Card>
            )}

            {/* 전력 거래 유형 차트 제거됨 */}
          </div>
        </TabsContent>

        {/* 선 그래프 섹션 */}
        <TabsContent value="line" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aggregatedCostData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    비용 추이
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={aggregatedCostData.lineChartData} color="#4CAF50" yAxisUnit="원" />
                </CardContent>
              </Card>
            )}

            {aggregatedVolumeData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전량
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={aggregatedVolumeData.lineChartData} color="#2196F3" yAxisUnit="kWh" />
                </CardContent>
              </Card>
            )}

            {aggregatedInfoData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전 횟수
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={aggregatedInfoData.lineChartData} color="#FFC107" yAxisUnit="회" />
                </CardContent>
              </Card>
            )}

            {/* Replace the existing charger uptime card with the new stations operating rate card */}
            {aggregatedOperatingRateData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    충전소 가동률
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={aggregatedOperatingRateData.lineChartData} color="#F44336" yAxisUnit="%" />
                </CardContent>
              </Card>
            )}

            {aggregatedTradingData && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {timeRange === "day"
                      ? "일별"
                      : timeRange === "week"
                        ? "주별"
                        : timeRange === "month"
                          ? "월별"
                          : "연별"}{" "}
                    전력 거래량
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <LineChart data={aggregatedTradingData.lineChartData} color="#9C27B0" yAxisUnit="kWh" />
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
                    <div className="text-2xl font-bold">{uptimeData.overallUptime.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      전월 대비 {uptimeData.changePercent > 0 ? "+" : ""}
                      {uptimeData.changePercent}%
                    </p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                    <span className="text-xl font-bold">{uptimeData.overallUptime.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {uptimeData?.stationUptime?.map((station, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{station.name}</span>
                      <span className="font-semibold">{station.uptime.toFixed(1)}%</span>
                    </div>
                  ))}
                  {(!uptimeData?.stationUptime || uptimeData.stationUptime.length === 0) && (
                    <div className="text-center text-gray-500 py-2">가용성 데이터가 없습니다.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>충전기 고장 빈도</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {failureData &&
                    failureData.chargerFailures &&
                    failureData.chargerFailures.map((charger, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{charger.name}</span>
                        <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full"
                            style={{
                              width: `${Math.min(100, (charger.failureCount / 10) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm">{charger.failureCount}회</span>
                      </div>
                    ))}
                  {(!failureData || !failureData.chargerFailures || failureData.chargerFailures.length === 0) && (
                    <div className="text-center text-gray-500 py-2">고장 데이터가 없습니다.</div>
                  )}
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
      {tradingVolumeData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">전력 거래 분석</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradingRevenueData && (
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
                      <span>증감률</span>
                      <span
                        className={`font-medium ${tradingRevenueData.percentText.startsWith("-") ? "text-red-500" : "text-green-500"}`}
                      >
                        {tradingRevenueData.percentText}
                      </span>
                    </div>
                    {/* Keep legacy fields if they exist */}
                    {tradingRevenueData.salesRevenue !== undefined && (
                      <div className="flex justify-between items-center">
                        <span>전력 판매 수익</span>
                        <span className="font-medium text-green-500">
                          ₩{tradingRevenueData.salesRevenue.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {tradingRevenueData.purchaseCost !== undefined && (
                      <div className="flex justify-between items-center">
                        <span>전력 구매 비용</span>
                        <span className="font-medium text-red-500">
                          ₩{tradingRevenueData.purchaseCost.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {tradingPriceData && (
              <Card>
                <CardHeader>
                  <CardTitle>시간대별 전력 거래 가격</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {/* Use slotDetails if available */}
                    {tradingPriceData.slotDetails &&
                      tradingPriceData.slotDetails.map((slot, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{translateTimeSlot(slot.timeSlot)}</span>
                          <span className="font-medium">₩{slot.averagePrice}/kWh</span>
                        </div>
                      ))}

                    {/* Fall back to legacy fields if slotDetails is not available */}
                    {!tradingPriceData.slotDetails &&
                      tradingPriceData.priceByTimeSlot &&
                      tradingPriceData.priceByTimeSlot.map((slot, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{slot.timeSlot}</span>
                          <span className="font-medium">₩{slot.price}/kWh</span>
                        </div>
                      ))}

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">평균 거래 가격</span>
                        <span className="font-bold">
                          ₩{tradingPriceData.overallAverage || tradingPriceData.averagePrice || 0}/kWh
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>전력 거래량</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{tradingVolumeData.netVolume.toLocaleString()} kWh</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>증감률</span>
                    <span className="font-medium">{tradingVolumeData.percentText}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span>최대 거래량</span>
                      <span className="font-medium">
                        {new Date(tradingVolumeData.maxVolumeDate).toLocaleDateString()} (
                        {tradingVolumeData.maxVolume.toLocaleString()} kWh)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>최소 거래량</span>
                      <span className="font-medium">
                        {new Date(tradingVolumeData.minVolumeDate).toLocaleDateString()} (
                        {tradingVolumeData.minVolume.toLocaleString()} kWh)
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
