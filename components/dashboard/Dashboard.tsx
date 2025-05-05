import { Sidebar } from "@/components/layout/Sidebar"
import { DailyInfo } from "@/components/dashboard/widgets/DailyInfo"
import { HourlyGeneration } from "@/components/dashboard/widgets/HourlyGeneration"
import { ChargerUsage } from "@/components/dashboard/widgets/ChargerUsage"
import { ElectricityTrading } from "@/components/dashboard/widgets/ElectricityTrading"
import { StationInfo } from "@/components/dashboard/widgets/StationInfo"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
          {/* 시간대별 발전량 */}
          <HourlyGeneration />

          {/* 일일 정보 */}
          <DailyInfo />

          {/* 충전기 사용 정보 */}
          <ChargerUsage />

          {/* 실시간 전기 거래 현황 */}
          <ElectricityTrading />

          {/* 등록 충전소 정보 */}
          <StationInfo />
        </div>
      </div>
    </div>
  )
}
