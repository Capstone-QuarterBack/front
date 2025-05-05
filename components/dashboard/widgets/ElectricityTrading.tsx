import { Card } from "@/components/ui/Card"
import { TradingPanel } from "@/components/dashboard/TradingPanel"

export function ElectricityTrading() {
  const buyData = {
    title: "한국 전력 공사",
    amount: "₩ 13,211,122",
    change: "▲ 68.20",
    isPositive: true,
    transactions: Array(5)
      .fill(0)
      .map(() => ({
        time: "2023/03/21 08:10:00",
        status: "거래되기",
      })),
  }

  const sellData = {
    title: "한국 전력 공사",
    amount: "₩ 2,211,122",
    change: "▼ 68.20",
    isPositive: false,
    transactions: Array(5)
      .fill(0)
      .map(() => ({
        time: "2023/03/21 08:10:00",
        status: "거래되기",
      })),
  }

  return (
    <Card
      title="실시간 전기 거래 현황"
      headerRight={
        <div className="text-xs">
          <span>Table</span> | <span className="text-zinc-400">Graph</span>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        <TradingPanel data={buyData} />
        <TradingPanel data={sellData} />
      </div>
    </Card>
  )
}
