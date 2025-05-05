import { Card } from "@/components/ui/Card"

export function DailyInfo() {
  return (
    <Card title="일일 정보">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
          <span className="text-zinc-400">Usage</span>
          <span className="font-medium">215</span>
        </div>
        <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
          <span className="text-amber-500">Profit</span>
          <span className="text-amber-500 font-medium">수익</span>
        </div>
        <div className="flex justify-between items-center border-b border-zinc-700 pb-2">
          <span className="text-teal-500">Charge</span>
          <span className="text-teal-500 font-medium">방전량</span>
        </div>
      </div>
    </Card>
  )
}
