"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchStationActionList } from "@/services/ocppLogApi"
import { Loader2 } from "lucide-react"

interface OcppLogFilterProps {
  onFilter: (
    startDate: string | undefined,
    endDate: string | undefined,
    action: string | undefined,
    messageType: number | undefined,
    stationId: string | undefined,
  ) => void
}

export function OcppLogFilter({ onFilter }: OcppLogFilterProps) {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [action, setAction] = useState<string>("")
  const [messageType, setMessageType] = useState<string>("")
  const [stationId, setStationId] = useState<string>("")

  const [stationList, setStationList] = useState<string[]>([])
  const [actionList, setActionList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStationActionList() {
      try {
        setLoading(true)
        const data = await fetchStationActionList()
        setStationList(data.stationList)
        setActionList(data.actionList)
      } catch (error) {
        console.error("Failed to load station and action lists:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStationActionList()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 숫자로 변환하거나 undefined로 설정
    const messageTypeNum = messageType ? Number.parseInt(messageType) : undefined

    onFilter(startDate || undefined, endDate || undefined, action || undefined, messageTypeNum, stationId || undefined)
  }

  const handleReset = () => {
    setStartDate("")
    setEndDate("")
    setAction("")
    setMessageType("")
    setStationId("")

    onFilter(undefined, undefined, undefined, undefined, undefined)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">시작 날짜</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">종료 날짜</Label>
          <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="messageType">메시지 타입</Label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger id="messageType">
              <SelectValue placeholder="메시지 타입 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="2">Request</SelectItem>
              <SelectItem value="3">Response</SelectItem>
              <SelectItem value="4">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="action">액션</Label>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger id="action" disabled={loading}>
              <SelectValue placeholder={loading ? "로딩 중..." : "액션 선택"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {actionList.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="stationId">충전소</Label>
          <Select value={stationId} onValueChange={setStationId}>
            <SelectTrigger id="stationId" disabled={loading}>
              <SelectValue placeholder={loading ? "로딩 중..." : "충전소 선택"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {stationList.map((station) => (
                <SelectItem key={station} value={station}>
                  {station}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          필터 적용
        </Button>
        <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
          초기화
        </Button>
      </div>
    </form>
  )
}
