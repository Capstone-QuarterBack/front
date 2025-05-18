"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OcppLogDetailModal } from "./OcppLogDetailModal"
import { OcppWebSocketService, type OcppWebSocketMessage } from "@/services/ocppWebSocketService"
import { formatTimestamp } from "@/lib/utils/date-utils"
import { Download, Pause, Play, RefreshCw, Trash2, WifiOff } from "lucide-react"

export default function OcppLiveMonitor() {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [messages, setMessages] = useState<OcppWebSocketMessage[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [autoScroll, setAutoScroll] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<OcppWebSocketMessage | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [directionFilter, setDirectionFilter] = useState<string>("all")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsServiceRef = useRef<OcppWebSocketService | null>(null)

  // 필터링된 메시지
  const filteredMessages = messages.filter((msg) => {
    if (directionFilter === "all") return true
    return msg.direction === directionFilter
  })

  useEffect(() => {
    // WebSocket 서비스 인스턴스 생성
    wsServiceRef.current = new OcppWebSocketService()

    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!wsServiceRef.current) return

    // 연결 상태 변경 이벤트 핸들러
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected)
      setIsConnecting(false)
      if (connected) {
        setConnectionError(null)
      }
    }

    // 연결 오류 이벤트 핸들러
    const handleConnectionError = (error: string) => {
      setConnectionError(error)
      setIsConnecting(false)
      setIsConnected(false)
    }

    // 메시지 수신 이벤트 핸들러
    const handleMessage = (message: OcppWebSocketMessage) => {
      if (!isPaused) {
        setMessages((prev) => [...prev, message])
      }
    }

    // 이벤트 리스너 등록
    wsServiceRef.current.onConnectionChange(handleConnectionChange)
    wsServiceRef.current.onConnectionError(handleConnectionError)
    wsServiceRef.current.onMessage(handleMessage)

    // 이벤트 리스너 정리
    return () => {
      if (wsServiceRef.current) {
        wsServiceRef.current.offConnectionChange(handleConnectionChange)
        wsServiceRef.current.offConnectionError(handleConnectionError)
        wsServiceRef.current.offMessage(handleMessage)
      }
    }
  }, [isPaused])

  // 자동 스크롤
  useEffect(() => {
    if (autoScroll && !isPaused && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [filteredMessages, autoScroll, isPaused])

  const handleConnect = () => {
    if (!wsServiceRef.current) return

    setIsConnecting(true)
    setConnectionError(null)
    wsServiceRef.current.connect()
  }

  const handleDisconnect = () => {
    if (!wsServiceRef.current) return

    wsServiceRef.current.disconnect()
  }

  const handleClearMessages = () => {
    setMessages([])
  }

  const handleExportMessages = () => {
    const data = JSON.stringify(messages, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ocpp-logs-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 메시지 클릭 핸들러 수정
  const handleMessageClick = (message: OcppWebSocketMessage) => {
    // 메시지가 유효한지 확인
    if (message && typeof message === "object") {
      setSelectedMessage(message)
      setIsDetailModalOpen(true)
    }
  }

  const getDirectionBadge = (direction: string) => {
    if (direction === "incoming") {
      return (
        <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800">
          수신
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-amber-900/20 text-amber-300 border-amber-800">
          송신
        </Badge>
      )
    }
  }

  const getConnectionStatusBadge = () => {
    if (isConnecting) {
      return (
        <Badge variant="outline" className="bg-blue-900/20 text-blue-300 border-blue-800">
          연결 중...
        </Badge>
      )
    } else if (isConnected) {
      return (
        <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-800">
          연결됨
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-800">
          연결 끊김
        </Badge>
      )
    }
  }

  // 메시지에서 액션 이름 추출
  const getMessageAction = (message: OcppWebSocketMessage): string => {
    // 원본 데이터에서 액션 이름 추출 시도
    const rawData = message.rawData

    try {
      // 문자열인 경우 파싱 시도
      if (typeof rawData === "string") {
        const parsed = JSON.parse(rawData)

        // OCPP 메시지 형식 [MessageTypeId, UniqueId, Action/Payload]
        if (Array.isArray(parsed)) {
          // 메시지 타입에 따라 다른 처리
          const messageTypeId = parsed[0]

          if (messageTypeId === 2 && typeof parsed[2] === "string") {
            // 요청 메시지: [2, "uniqueId", "Action", {...}]
            return parsed[2]
          } else if (messageTypeId === 3) {
            // 응답 메시지: [3, "uniqueId", {...}]
            // 응답 메시지는 액션 이름이 없으므로 "응답"으로 표시
            return "응답"
          } else if (messageTypeId === 4) {
            // 오류 메시지: [4, "uniqueId", {...}]
            return "오류"
          }
        }
      } else if (Array.isArray(rawData)) {
        // 이미 배열인 경우
        const messageTypeId = rawData[0]

        if (messageTypeId === 2 && typeof rawData[2] === "string") {
          return rawData[2]
        } else if (messageTypeId === 3) {
          return "응답"
        } else if (messageTypeId === 4) {
          return "오류"
        }
      }
    } catch (e) {
      // 파싱 실패 시 기본값 사용
    }

    // 기본값
    return message.action || "알 수 없음"
  }

  // 메시지 ID 추출
  const getMessageId = (message: OcppWebSocketMessage): string => {
    const rawData = message.rawData

    try {
      // 문자열인 경우 파싱 시도
      if (typeof rawData === "string") {
        const parsed = JSON.parse(rawData)

        // OCPP 메시지 형식 [MessageTypeId, UniqueId, Action/Payload]
        if (Array.isArray(parsed) && parsed.length > 1 && typeof parsed[1] === "string") {
          return parsed[1]
        }
      } else if (Array.isArray(rawData) && rawData.length > 1 && typeof rawData[1] === "string") {
        return rawData[1]
      }
    } catch (e) {
      // 파싱 실패 시 기본값 사용
    }

    // 기본값
    return message.messageId || "알 수 없음"
  }

  // 메시지에서 간단한 설명 추출
  const getMessageSummary = (message: OcppWebSocketMessage): string => {
    const rawData = message.rawData

    try {
      let parsed = rawData

      // 문자열인 경우 파싱 시도
      if (typeof rawData === "string") {
        parsed = JSON.parse(rawData)
      }

      // OCPP 메시지 형식 [MessageTypeId, UniqueId, Action/Payload]
      if (Array.isArray(parsed)) {
        const messageTypeId = parsed[0]

        if (messageTypeId === 2 && parsed.length > 3 && typeof parsed[3] === "object") {
          // 요청 메시지의 주요 필드 추출
          const payload = parsed[3]

          if (parsed[2] === "BootNotification" && payload.chargingStation) {
            return `모델: ${payload.chargingStation.model || "알 수 없음"}, 벤더: ${payload.chargingStation.vendorName || "알 수 없음"}`
          } else if (parsed[2] === "StatusNotification" && payload.status) {
            return `상태: ${payload.status}`
          } else if (parsed[2] === "Authorize" && payload.idToken) {
            return `ID: ${payload.idToken.idToken || "알 수 없음"}`
          } else if (parsed[2] === "MeterValues" && payload.meterValue) {
            return `미터값 업데이트`
          } else if (parsed[2] === "Heartbeat") {
            return `하트비트`
          }
        } else if (messageTypeId === 3 && parsed.length > 2 && typeof parsed[2] === "object") {
          // 응답 메시지의 주요 필드 추출
          const payload = parsed[2]

          if (payload.status) {
            return `상태: ${payload.status}`
          } else if (payload.currentTime) {
            return `시간: ${payload.currentTime.split("T")[1].split(".")[0]}`
          }
        }
      }
    } catch (e) {
      // 파싱 실패 시 기본값 사용
    }

    // 기본값
    return message.summary || ""
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        {/* 연결 컨트롤 */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-800 rounded-md">
          <div className="flex items-center gap-2">
            <span>WebSocket 상태:</span>
            {getConnectionStatusBadge()}
          </div>

          <div className="flex items-center gap-2">
            {!isConnected ? (
              <Button onClick={handleConnect} disabled={isConnecting} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                연결
              </Button>
            ) : (
              <Button onClick={handleDisconnect} variant="destructive">
                <WifiOff className="mr-2 h-4 w-4" />
                연결 해제
              </Button>
            )}
          </div>
        </div>

        {/* 연결 오류 */}
        {connectionError && (
          <div className="p-4 bg-red-900/20 border border-red-700 text-red-300 rounded-md">
            <p className="font-semibold">연결 오류:</p>
            <p>{connectionError}</p>
          </div>
        )}

        {/* 로그 컨트롤 */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-zinc-800 rounded-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="auto-scroll" checked={autoScroll} onCheckedChange={setAutoScroll} />
              <Label htmlFor="auto-scroll">자동 스크롤</Label>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="direction-filter">방향 필터:</Label>
              <Select value={directionFilter} onValueChange={setDirectionFilter}>
                <SelectTrigger id="direction-filter" className="w-32">
                  <SelectValue placeholder="방향 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="incoming">수신</SelectItem>
                  <SelectItem value="outgoing">송신</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  재개
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  일시 정지
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleClearMessages}>
              <Trash2 className="mr-2 h-4 w-4" />
              지우기
            </Button>

            <Button variant="outline" onClick={handleExportMessages} disabled={messages.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
          </div>
        </div>

        {/* 로그 표시 - 간결한 형태로 변경 */}
        <div className="h-[600px] overflow-y-auto bg-zinc-900 rounded-md p-2">
          {filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-500">
              {isConnected ? "메시지를 기다리는 중..." : "WebSocket에 연결하여 메시지를 수신하세요."}
            </div>
          ) : (
            filteredMessages.map((msg, index) => (
              <div
                key={index}
                className="p-3 mb-2 rounded hover:bg-zinc-800 cursor-pointer border border-zinc-800"
                onClick={() => handleMessageClick(msg)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400 text-sm">{formatTimestamp(msg.timestamp)}</span>
                    {getDirectionBadge(msg.direction)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-semibold text-zinc-200">{getMessageAction(msg)}</div>
                  <div className="text-sm text-zinc-400 mt-1 truncate" title={getMessageId(msg)}>
                    ID: {getMessageId(msg)}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">{getMessageSummary(msg)}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 상세 정보 모달 */}
      {selectedMessage && (
        <OcppLogDetailModal
          log={selectedMessage}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </Card>
  )
}
