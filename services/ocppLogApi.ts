// OCPP 로그 API 서비스
import { API_BASE_URL } from "./apiConfig"
export interface OcppMessage {
  timestamp: string
  stationId: string
  messageType: number
  action: string
  rawMessage: any
  summary?: string // 클라이언트에서 생성하는 요약 정보
}

export interface OcppLogResponse {
  currentPage: number
  totalPages: number
  totalElements: number
  content: OcppMessage[]
}

export interface StationActionListResponse {
  stationList: string[]
  actionList: string[]
}

// OCPP 메시지 요약 생성 함수
export function generateSummary(log: OcppMessage): string {
  try {
    const rawMessage = log.rawMessage

    // 메시지 타입에 따라 다른 요약 생성
    if (log.messageType === 2) {
      // Request
      if (log.action === "BootNotification") {
        return `충전소 부팅 알림: ${rawMessage[3]?.chargingStation?.model || "Unknown model"}`
      } else if (log.action === "Heartbeat") {
        return "충전소 상태 확인 신호"
      } else if (log.action === "StatusNotification") {
        return `상태 알림: ${rawMessage[3]?.status || "Unknown status"}`
      } else if (log.action === "Authorize") {
        return `인증 요청: ${rawMessage[3]?.idToken?.idToken || "Unknown ID"}`
      } else if (log.action === "TransactionEvent") {
        return `트랜잭션 이벤트: ${rawMessage[3]?.eventType || "Unknown event"}`
      } else if (log.action === "MeterValues") {
        return "미터 값 전송"
      }
    } else if (log.messageType === 3) {
      // Response
      if (log.action === "BootNotification") {
        return `부팅 응답: ${rawMessage[2]?.status || "Unknown status"}`
      } else if (log.action === "Heartbeat") {
        return "상태 확인 응답"
      } else if (log.action === "StatusNotification") {
        return "상태 알림 응답"
      } else if (log.action === "Authorize") {
        return `인증 응답: ${rawMessage[2]?.idTokenInfo?.status || "Unknown status"}`
      } else if (log.action === "TransactionEvent") {
        return "트랜잭션 이벤트 응답"
      } else if (log.action === "MeterValues") {
        return "미터 값 응답"
      }
    } else if (log.messageType === 4) {
      // Error
      return `오류: ${rawMessage[2]?.errorCode || "Unknown error"}`
    }

    // 기본 요약
    return `${log.action} 메시지`
  } catch (error) {
    console.error("Error generating summary:", error)
    return "메시지 요약을 생성할 수 없습니다."
  }
}

// 충전소 및 액션 목록 조회
export async function fetchStationActionList(): Promise<StationActionListResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ocpp-log/station-action-list`)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching station action list:", error)
    throw error
  }
}

// OCPP 로그 검색
export async function fetchOcppLogs(
  startDate?: string,
  endDate?: string,
  action?: string,
  messageType?: number,
  stationId?: string,
  page = 0,
  size = 10,
): Promise<OcppLogResponse> {
  try {
    // 요청 바디 구성
    const requestBody = {
      stationId: stationId,
      startDate: startDate,
      endDate: endDate,
      messageType: messageType,
      action: action,
      page: page,
      size: size,
    }

    // 빈 값 제거
    Object.keys(requestBody).forEach((key) => {
      if (requestBody[key as keyof typeof requestBody] === undefined) {
        delete requestBody[key as keyof typeof requestBody]
      }
    })

    const response = await fetch(`${API_BASE_URL}/ocpp-log/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching OCPP logs:", error)
    throw error
  }
}
