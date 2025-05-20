"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FileText } from "lucide-react"

interface TransactionSearchProps {
  onStationSearch: (stationName: string) => void
  onApprovalSearch: (approvalNumber: string) => void
  currentStation: string
}

export function TransactionSearch({ onStationSearch, onApprovalSearch, currentStation }: TransactionSearchProps) {
  const [stationSearchTerm, setStationSearchTerm] = useState<string>(currentStation || "")
  const [approvalSearchTerm, setApprovalSearchTerm] = useState<string>("")

  const handleStationSearch = () => {
    if (stationSearchTerm.trim()) {
      onStationSearch(stationSearchTerm.trim())
    }
  }

  const handleApprovalSearch = () => {
    if (approvalSearchTerm.trim()) {
      onApprovalSearch(approvalSearchTerm.trim())
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Station Name Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 w-full sm:w-64">
            <Input
              className="pl-8 h-9 bg-zinc-700 border-zinc-600 w-full"
              placeholder="충전소 이름으로 검색하세요"
              value={stationSearchTerm}
              onChange={(e) => setStationSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStationSearch()}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
          </div>
          <Button className="h-9 px-4" onClick={handleStationSearch}>
            검색
          </Button>
        </div>
      </div>

      {/* Approval Number Search - Shorter version */}
      <div className="flex items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Input
            className="pl-8 h-9 bg-zinc-700 border-zinc-600 w-full"
            placeholder="승인번호로 검색하세요"
            value={approvalSearchTerm}
            onChange={(e) => setApprovalSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApprovalSearch()}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
        </div>
        <Button className="h-9 px-4" onClick={handleApprovalSearch}>
          검색
        </Button>
      </div>
    </div>
  )
}
