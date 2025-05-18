"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatTimestamp } from "@/lib/utils/date-utils"
import type { OcppMessage } from "@/services/ocppLogApi"
import type { OcppWebSocketMessage } from "@/services/ocppWebSocketService"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface OcppLogDetailModalProps {
  log: OcppMessage | OcppWebSocketMessage
  isOpen: boolean
  onClose: () => void
}

export function OcppLogDetailModal({ log, isOpen, onClose }: OcppLogDetailModalProps) {
  const [copied, setCopied] = useState(false)

  // 메시지 타입에 따라 적절한 데이터 필드 사용
  const rawData = "rawMessage" in log ? log.rawMessage : log.rawData

  // 메시지 타입 결정 로직 개선
  let messageType = 2 // 기본값
  let messageTypeLabel = "요청"

  if ("messageType" in log) {
    if (typeof log.messageType === "number") {
      messageType = log.messageType
    } else if (log.messageType === "ErrorResponse") {
      messageType = 4
    }
  }

  // 원본 데이터에서 메시지 타입 추출 시도
  if (typeof rawData === "string") {
    try {
      const parsedData = JSON.parse(rawData)
      if (Array.isArray(parsedData) && parsedData.length > 0 && typeof parsedData[0] === "number") {
        messageType = parsedData[0]
      }
    } catch (e) {
      // 파싱 실패 시 기본값 유지
    }
  } else if (Array.isArray(rawData) && rawData.length > 0 && typeof rawData[0] === "number") {
    messageType = rawData[0]
  }

  // 메시지 타입에 따른 라벨 설정
  switch (messageType) {
    case 2:
      messageTypeLabel = "요청"
      break
    case 3:
      messageTypeLabel = "응답"
      break
    case 4:
      messageTypeLabel = "오류"
      break
    default:
      messageTypeLabel = "알 수 없음"
  }

  const getMessageTypeLabel = (type: number) => {
    switch (type) {
      case 2:
        return (
          <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800">
            요청
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-800">
            응답
          </Badge>
        )
      case 4:
        return (
          <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-800">
            오류
          </Badge>
        )
      default:
        return <Badge variant="outline">알 수 없음</Badge>
    }
  }

  // 원본 데이터에서 액션 추출 시도
  let action = "action" in log && log.action ? log.action : "Unknown"
  let uniqueId = ""
  let payload = null

  if (typeof rawData === "string") {
    try {
      const parsedData = JSON.parse(rawData)
      if (Array.isArray(parsedData) && parsedData.length > 2) {
        uniqueId = typeof parsedData[1] === "string" ? parsedData[1] : ""

        if (messageType === 2 && typeof parsedData[2] === "string") {
          action = parsedData[2]
          payload = parsedData.length > 3 ? parsedData[3] : null
        } else if (messageType === 3 || messageType === 4) {
          payload = parsedData[2]
        }
      }
    } catch (e) {
      // 파싱 실패 시 기본값 유지
    }
  } else if (Array.isArray(rawData) && rawData.length > 2) {
    uniqueId = typeof rawData[1] === "string" ? rawData[1] : ""

    if (messageType === 2 && typeof rawData[2] === "string") {
      action = rawData[2]
      payload = rawData.length > 3 ? rawData[3] : null
    } else if (messageType === 3 || messageType === 4) {
      payload = rawData[2]
    }
  }

  // 원본 데이터에서 충전소 ID 추출 시도
  let stationId = "stationId" in log && log.stationId ? log.stationId : "알 수 없음"

  // 페이로드에서 충전소 ID 추출 시도
  if (payload && typeof payload === "object") {
    if (payload.customData && payload.customData.stationId) {
      stationId = payload.customData.stationId
    } else if (payload.chargingStation && payload.chargingStation.serialNumber) {
      stationId = payload.chargingStation.serialNumber
    }
  }

  // 복사 기능
  const copyToClipboard = () => {
    const textToCopy = typeof rawData === "string" ? rawData : JSON.stringify(rawData, null, 2)
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // 포맷된 JSON 문자열 생성
  const getFormattedJson = () => {
    try {
      if (typeof rawData === "string") {
        return JSON.stringify(JSON.parse(rawData), null, 2)
      } else {
        return JSON.stringify(rawData, null, 2)
      }
    } catch (e) {
      return typeof rawData === "string" ? rawData : JSON.stringify(rawData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>OCPP 메시지 상세 정보</span>
            <Button variant="outline" size="sm" onClick={copyToClipboard} className="ml-2">
              <Copy className="h-4 w-4 mr-1" />
              {copied ? "복사됨" : "복사"}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">타임스탬프</p>
            <p className="font-mono">{formatTimestamp(log.timestamp)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">메시지 ID</p>
            <p className="font-mono text-sm truncate" title={uniqueId}>
              {uniqueId || "알 수 없음"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">메시지 타입</p>
            <div className="flex items-center gap-2">
              {getMessageTypeLabel(messageType)}
              <span>{messageTypeLabel}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">액션</p>
            <p>{action}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">충전소 ID</p>
            <p>{stationId}</p>
          </div>
        </div>

        <Tabs defaultValue="formatted">
          <TabsList className="mb-4">
            <TabsTrigger value="formatted">포맷된 JSON</TabsTrigger>
            <TabsTrigger value="raw">원본 데이터</TabsTrigger>
            {payload && <TabsTrigger value="payload">페이로드</TabsTrigger>}
          </TabsList>

          <TabsContent value="formatted" className="mt-0">
            <div className="bg-zinc-900 rounded-md p-4 overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">{getFormattedJson()}</pre>
            </div>
          </TabsContent>

          <TabsContent value="raw" className="mt-0">
            <div className="bg-zinc-900 rounded-md p-4 overflow-auto max-h-[400px]">
              <pre className="text-sm whitespace-pre-wrap">
                {typeof rawData === "string" ? rawData : JSON.stringify(rawData)}
              </pre>
            </div>
          </TabsContent>

          {payload && (
            <TabsContent value="payload" className="mt-0">
              <div className="bg-zinc-900 rounded-md p-4 overflow-auto max-h-[400px]">
                <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(payload, null, 2)}</pre>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
