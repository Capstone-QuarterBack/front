import { Sidebar } from "@/components/layout/Sidebar"
import { DailyInfo } from "@/components/dashboard/widgets/DailyInfo"
import { HourlyGeneration } from "@/components/dashboard/widgets/HourlyGeneration"
import { ChargerUsage } from "@/components/dashboard/widgets/ChargerUsage"
import { ElectricityTrading } from "@/components/dashboard/widgets/ElectricityTrading"
import { StationInfo } from "@/components/dashboard/widgets/StationInfo"
import { getResponsiveGridClass } from "@/lib/utils/style-utils"

// 위젯 레이아웃 설정
const WIDGET_LAYOUT = {
  hourlyGeneration: { base: 1, md: 2, xl: 3 },
  dailyInfo: { base: 1, md: 1 },
  chargerUsage: { base: 1, md: 2, lg: 3, xl: 2 },
  electricityTrading: { base: 1, md: 2, xl: 2 },
  stationInfo: { base: 1, md: 2, lg: 3, xl: 4 },
}

interface DashboardProps {
  refreshInterval?: number // 데이터 새로고침 간격 (밀리초)
}

export default function Dashboard({ refreshInterval = 0 }: DashboardProps) {
  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 p-3 md:p-4">
          {/* 시간대별 발전량 */}
          <div className={getResponsiveGridClass(WIDGET_LAYOUT.hourlyGeneration)}>
            <HourlyGeneration refreshInterval={refreshInterval} />
          </div>

          {/* 일일 정보 */}
          <div className={getResponsiveGridClass(WIDGET_LAYOUT.dailyInfo)}>
            <DailyInfo refreshInterval={refreshInterval} />
          </div>

          {/* 충전기 사용 정보 */}
          <div className={getResponsiveGridClass(WIDGET_LAYOUT.chargerUsage)}>
            <ChargerUsage refreshInterval={refreshInterval} />
          </div>

          {/* 실시간 전기 거래 현황 */}
          <div className={getResponsiveGridClass(WIDGET_LAYOUT.electricityTrading)}>
            <ElectricityTrading refreshInterval={refreshInterval} />
          </div>

          {/* 등록 충전소 정보 */}
          <div className={getResponsiveGridClass(WIDGET_LAYOUT.stationInfo)}>
            <StationInfo refreshInterval={refreshInterval} />
          </div>
        </div>
      </div>
    </div>
  )
}
