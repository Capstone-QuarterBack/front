"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText } from "lucide-react"

export function TransactionSearch() {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            className="pl-8 h-9 bg-zinc-700 border-zinc-600 w-full sm:w-64"
            placeholder="검색할 충전소를 입력하세요"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
        <Button className="h-9">검색</Button>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="h-9 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>+ 내역 추가</span>
        </Button>
      </div>
    </div>
  )
}
