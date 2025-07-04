// 파일 상단에 apiConfig 임포트 추가
import { WEBSOCKET_URL } from "./apiConfig"

// WebSocket ���비스 타입 정의
export interface OcppWebSocketMessage {
  id: string
  messageId: string
  timestamp: string
  rawData: any
  // 기본 표시용 필드 (최소한의 파싱)
  direction: "incoming" | "outgoing"
  summary: string
  // 타입 에러 해결을 위한 추가 필드
  stationId?: string
  action?: string
  messageType?: string | number
}

// 싱글톤 인스턴스를 저장할 변수
let instance: OcppWebSocketService | null = null

// 전역 메시지 저장소
let globalMessages: OcppWebSocketMessage[] = []
let isPaused = false

export class OcppWebSocketService {
  private socket: WebSocket | null = null
  private url: string
  private messageListeners: ((message: OcppWebSocketMessage) => void)[] = []
  private messagesUpdateListeners: ((messages: OcppWebSocketMessage[]) => void)[] = []
  private connectionChangeListeners: ((connected: boolean) => void)[] = []
  private connectionErrorListeners: ((error: string) => void)[] = []
  private autoReconnect = true
  private reconnectTimer: any = null
  private reconnectInterval = 5000 // 5초마다 재연결 시도

  constructor(url?: string) {
    // Use the provided URL or the URL from apiConfig
    this.url = url || WEBSOCKET_URL
  }

  // 싱글톤 인스턴스 가져오기
  static getInstance(url?: string): OcppWebSocketService {
    if (!instance) {
      instance = new OcppWebSocketService(url)
    }
    return instance
  }

  // 일시정지 상태 설정
  setPaused(paused: boolean): void {
    isPaused = paused
  }

  // 일시정지 상태 가져오기
  isPaused(): boolean {
    return isPaused
  }

  // 모든 메시지 가져오기
  getAllMessages(): OcppWebSocketMessage[] {
    return [...globalMessages]
  }

  // 메시지 지우기
  clearMessages(): void {
    globalMessages = []
    this.notifyMessagesUpdateListeners(globalMessages)
  }

  // WebSocket 연결
  connect() {
    try {
      if (
        this.socket &&
        (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
      ) {
        return
      }

      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        this.notifyConnectionChange(true)
        // 연결 성공 시 재연결 타이머 초기화
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer)
          this.reconnectTimer = null
        }
      }

      this.socket.onclose = () => {
        this.notifyConnectionChange(false)
        // 자동 재연결이 활성화된 경우 재연결 시도
        if (this.autoReconnect) {
          this.scheduleReconnect()
        }
      }

      this.socket.onerror = (event) => {
        this.notifyConnectionError("WebSocket 연결 오류가 발생했습니다.")
        // 오류 발생 시 재연결 시도
        if (this.autoReconnect) {
          this.scheduleReconnect()
        }
      }

      this.socket.onmessage = (event) => {
        try {
          // 원본 데이터 그대로 유지
          let data = event.data

          // 문자열이 아닌 경우 문자열로 변환
          if (typeof data !== "string") {
            data = String(data)
          }

          // JSON 파싱 시도 (디스플레이 목적으로만)
          let parsedData
          try {
            parsedData = JSON.parse(data)
          } catch (e) {
            parsedData = data
          }

          // 메시지 정보 추출
          const message = this.parseOcppMessage(data, parsedData)

          // 일시정지 상태가 아닐 때만 메시지 추가
          if (!isPaused) {
            // 전역 메시지 저장소에 추가
            globalMessages.push(message)

            // 메시지 리스너에게 알림
            this.notifyMessageListeners(message)

            // 메시지 업데이트 리스너에게 알림
            this.notifyMessagesUpdateListeners(globalMessages)
          }
        } catch (error) {
          console.error("WebSocket 메시지 처리 오류:", error)
        }
      }
    } catch (error) {
      console.error("WebSocket 연결 생성 오류:", error)
      this.notifyConnectionError("WebSocket 연결을 생성할 수 없습니다.")
    }
  }

  // 재연결 스케줄링
  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectTimer = setTimeout(() => {
      console.log("WebSocket 재연결 시도 중...")
      this.connect()
    }, this.reconnectInterval)
  }

  // 자동 재연결 설정
  setAutoReconnect(enable: boolean) {
    this.autoReconnect = enable

    // 자동 재연결이 비활성화되면 예약된 재연결 취소
    if (!enable && this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  // 간단한 방향 결정 (최소한의 파싱)
  private determineDirection(data: any): "incoming" | "outgoing" {
    // OCPP 메시지 형식 [MessageTypeId, UniqueId, ...]에서 MessageTypeId로 방향 추정
    if (Array.isArray(data) && data.length >= 2) {
      const messageTypeId = data[0]
      // 2: 요청(incoming), 3: 응답(outgoing), 4: 오류(outgoing)
      return messageTypeId === 2 ? "incoming" : "outgoing"
    }

    // 기본값
    return "incoming"
  }

  // 간단한 요약 생성 (최소한의 파싱)
  private createSimpleSummary(data: any): string {
    try {
      if (Array.isArray(data) && data.length >= 3) {
        // OCPP 메시지 형식 [MessageTypeId, UniqueId, Action/Payload]
        const messageTypeId = data[0]

        if (messageTypeId === 2 && typeof data[2] === "string") {
          return `요청: ${data[2]}`
        } else if (messageTypeId === 3) {
          return `응답: ${JSON.stringify(data[2]).substring(0, 50)}...`
        } else if (messageTypeId === 4) {
          return `오류: ${JSON.stringify(data[2]).substring(0, 50)}...`
        }
      }

      // 기본 요약
      return typeof data === "object"
        ? JSON.stringify(data).substring(0, 50) + "..."
        : String(data).substring(0, 50) + "..."
    } catch (e) {
      return "메시지 요약 불가"
    }
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.socket) {
      // 자동 재연결 비활성화
      this.autoReconnect = false

      // 예약된 재연결 취소
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }

      this.socket.close()
      this.socket = null
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN
  }

  // 메시지 수신 이벤트 리스너 등록
  onMessage(listener: (message: OcppWebSocketMessage) => void) {
    this.messageListeners.push(listener)
  }

  // 메시지 수신 이벤트 리스너 제거
  offMessage(listener: (message: OcppWebSocketMessage) => void) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener)
  }

  // 메시지 업데이트 이벤트 리스너 등록
  onMessagesUpdate(listener: (messages: OcppWebSocketMessage[]) => void) {
    this.messagesUpdateListeners.push(listener)
    // 등록 시 현재 메시지 목록 전달
    listener(globalMessages)
  }

  // 메시지 업데이트 이벤트 리스너 제거
  offMessagesUpdate(listener: (messages: OcppWebSocketMessage[]) => void) {
    this.messagesUpdateListeners = this.messagesUpdateListeners.filter((l) => l !== listener)
  }

  // 연결 상태 변경 이벤트 리스너 등록
  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionChangeListeners.push(listener)
  }

  // 연결 상태 변경 이벤트 리스너 제거
  offConnectionChange(listener: (connected: boolean) => void) {
    this.connectionChangeListeners = this.connectionChangeListeners.filter((l) => l !== listener)
  }

  // 연결 오류 이벤트 리스너 등록
  onConnectionError(listener: (error: string) => void) {
    this.connectionErrorListeners.push(listener)
  }

  // 연결 오류 이벤트 리스너 제거
  offConnectionError(listener: (error: string) => void) {
    this.connectionErrorListeners = this.connectionErrorListeners.filter((l) => l !== listener)
  }

  // 메시지 리스너에게 알림
  private notifyMessageListeners(message: OcppWebSocketMessage) {
    this.messageListeners.forEach((listener) => listener(message))
  }

  // 메시지 업데이트 리스너에게 알림
  private notifyMessagesUpdateListeners(messages: OcppWebSocketMessage[]) {
    this.messagesUpdateListeners.forEach((listener) => listener([...messages]))
  }

  // 연결 상태 변경 리스너에게 알림
  private notifyConnectionChange(connected: boolean) {
    this.connectionChangeListeners.forEach((listener) => listener(connected))
  }

  // 연결 오류 리스너에게 알림
  private notifyConnectionError(error: string) {
    this.connectionErrorListeners.forEach((listener) => listener(error))
  }

  // 메시지 파싱 로직 수정
  private parseOcppMessage(rawData: any, parsedData: any): OcppWebSocketMessage {
    // Generate a unique ID
    const uniqueId = crypto.randomUUID()

    // 메시지 ID 추출
    let messageId = uniqueId

    if (Array.isArray(parsedData) && parsedData.length > 1 && typeof parsedData[1] === "string") {
      messageId = parsedData[1]
    }

    // Try to determine message type and action
    let messageType: string | number = "Unknown"
    let action = "Unknown"
    let direction: "incoming" | "outgoing" = "incoming"
    let stationId = undefined
    let summary = ""

    // Handle different message formats
    if (Array.isArray(parsedData)) {
      // OCPP message format: [MessageTypeId, UniqueId, Action, Payload]
      const [messageTypeId, msgUniqueId, msgAction, payload] = parsedData

      // MessageTypeId에 따른 메시지 타입 결정
      messageType = messageTypeId

      // 2: 요청, 3: 응답, 4: 오류
      switch (messageTypeId) {
        case 2:
          direction = "incoming"
          action = typeof msgAction === "string" ? msgAction : "Unknown"
          break
        case 3:
          direction = "outgoing"
          action = typeof msgAction === "string" ? msgAction : "Unknown"
          break
        case 4:
          direction = "outgoing"
          action = "Error"
          break
      }

      // 충전소 ID 추출 시도
      if (payload && typeof payload === "object") {
        if (payload.customData && payload.customData.stationId) {
          stationId = payload.customData.stationId
        } else if (payload.chargingStation && payload.chargingStation.serialNumber) {
          stationId = payload.chargingStation.serialNumber
        }
      }

      // 간단한 요약 생성
      summary = this.createSimpleSummary(parsedData)
    }

    return {
      id: uniqueId,
      messageId: messageId,
      timestamp: new Date().toISOString(),
      direction,
      messageType,
      action,
      stationId,
      summary,
      rawData: rawData, // 원본 데이터 그대로 저장
    }
  }
}
