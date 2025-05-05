import { Search } from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StationList } from "@/components/dashboard/StationList"

export function StationInfo() {
  const stations = [
    {
      id: 1,
      status: "운영중",
      name: "Sejong131313",
      subName: "세종 충전소",
      address: "서울특별시 광진구 능동로 209 세종대학교",
      subAddress: "서울 광진구 군자동 98",
      registDate: "2023-05-30 16:24:14",
      stats: [
        { count: 3, color: "bg-zinc-500" },
        { count: 1, color: "bg-green-500" },
        { count: 2, color: "bg-red-500" },
        { count: 0, color: "bg-black" },
      ],
    },
  ]

  return (
    <Card
      title="등록 충전소 정보"
      className="lg:col-span-3"
      headerRight={
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input className="pl-8 h-8 bg-zinc-700 border-zinc-600 text-sm" placeholder="충전소를 입력해주세요" />
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            Add Station
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs">
            Delete Station
          </Button>
        </div>
      }
    >
      <StationList stations={stations} />
    </Card>
  )
}
