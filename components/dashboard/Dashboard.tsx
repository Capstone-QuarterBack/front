import { Sidebar } from "@/components/layout/Sidebar"
import { DailyInfo } from "@/components/dashboard/widgets/DailyInfo"
import { HourlyGeneration } from "@/components/dashboard/widgets/HourlyGeneration"
import { ChargerUsage } from "@/components/dashboard/widgets/ChargerUsage"
import { ElectricityTrading } from "@/components/dashboard/widgets/ElectricityTrading"
import { StationInfo } from "@/components/dashboard/widgets/StationInfo"

interface DashboardProps {
  refreshInterval?: number // 데이터 새로고침 간격 (밀리초)
}

export default function Dashboard({ refreshInterval = 60000 }: DashboardProps) {
  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar activeItem="dashboard" />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {/* 시간대별 발전량 */}
            <div className="col-span-1 md:col-span-2 xl:col-span-3">
              <HourlyGeneration refreshInterval={refreshInterval} />
            </div>

            {/* 일일 정보 */}
            <div className="col-span-1">
              <DailyInfo refreshInterval={refreshInterval} />
            </div>

            {/* 충전기 사용 정보 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-2">
              <ChargerUsage refreshInterval={refreshInterval} />
            </div>

            {/* 실시간 전기 거래 현황 */}
            <div className="col-span-1 md:col-span-2 xl:col-span-2">
              <ElectricityTrading />
            </div>

            {/* 등록 충전소 정보 */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
              <StationInfo refreshInterval={refreshInterval} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
