import { API_BASE_URL } from "./apiConfig"

export interface SampledValue {
  value: number
  context?: string
  measurand?: string
  phase?: string
  location?: string
  unit?: string
}

export interface MeterValue {
  timestamp: string
  sampledValue: SampledValue[]
}

// OcppMessage 인터페이스에 summary 속성 추가
export interface OcppMessage {
  id: string
  messageId: string
  messageType: string
  direction: "incoming" | "outgoing"
  timestamp: string
  action: string
  stationId: string
  chargerId: string
  summary?: string // summary 속성 추가
  payload: {
    evseId?: number
    meterValue?: MeterValue[]
    [key: string]: any
  }
  rawMessage: string
}

export interface OcppLogResponse {
  status: string
  data: {
    content: OcppMessage[]
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

// 기존 fetchOcppLogs 함수에 stationId와 chargerId 파라미터 추가
export async function fetchOcppLogs(
  startDate?: string,
  endDate?: string,
  messageType?: string,
  direction?: "incoming" | "outgoing",
  stationId?: string,
  chargerId?: string,
  page = 0,
  size = 10,
): Promise<OcppLogResponse> {
  try {
    console.log(`Fetching OCPP logs from ${startDate} to ${endDate}`)

    let url = `${API_BASE_URL}/v1/ocpp/logs?page=${page}&size=${size}`

    if (startDate) url += `&startDate=${startDate}`
    if (endDate) url += `&endDate=${endDate}`
    if (messageType) url += `&messageType=${messageType}`
    if (direction) url += `&direction=${direction}`
    if (stationId) url += `&stationId=${stationId}`
    if (chargerId) url += `&chargerId=${chargerId}`

    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("OCPP logs received:", data)

    // 응답 데이터에 summary 속성 추가
    const processedData = {
      ...data,
      data: {
        ...data.data,
        content: data.data.content.map((log: OcppMessage) => ({
          ...log,
          summary: generateSummary(log),
        })),
      },
    }

    return processedData
  } catch (error) {
    console.error("Error fetching OCPP logs:", error)

    // Return mock data in case of error (for development)
    return {
      status: "success",
      data: {
        content: [
          {
            id: "log1",
            messageId: "123456",
            messageType: "MeterValuesRequest",
            direction: "incoming",
            timestamp: "2025-03-25T10:00:00Z",
            action: "MeterValues",
            stationId: "STATION001",
            chargerId: "CHARGER001",
            summary: "미터 값: Current.Import: 10.5, Voltage: 220.0",
            payload: {
              evseId: 1,
              meterValue: [
                {
                  timestamp: "2025-03-25T10:00:00Z",
                  sampledValue: [
                    {
                      value: 10.5,
                      context: "Sample.Periodic",
                      measurand: "Current.Import",
                      phase: "L1",
                      location: "Outlet",
                    },
                    {
                      value: 220.0,
                      context: "Sample.Periodic",
                      measurand: "Voltage",
                      phase: "L1",
                      location: "Outlet",
                    },
                  ],
                },
              ],
            },
            rawMessage:
              '[2,"123456","MeterValuesRequest",{"evseId":1,"meterValue":[{"timestamp":"2025-03-25T10:00:00Z","sampledValue":[{"value":10.5,"context":"Sample.Periodic","measurand":"Current.Import","phase":"L1","location":"Outlet"},{"value":220.0,"context":"Sample.Periodic","measurand":"Voltage","phase":"L1","location":"Outlet"}]}]}]',
          },
          {
            id: "log2",
            messageId: "19223201",
            messageType: "MeterValues",
            direction: "outgoing",
            timestamp: "2025-03-25T12:00:00Z",
            action: "MeterValues",
            stationId: "STATION001",
            chargerId: "CHARGER002",
            summary: "미터 값: Power.Active.Export: 150.0",
            payload: {
              evseId: 1,
              meterValue: [
                {
                  timestamp: "2025-03-25T12:00:00Z",
                  sampledValue: [
                    {
                      value: 150.0,
                      context: "Sample.Periodic",
                      measurand: "Power.Active.Export",
                    },
                  ],
                },
              ],
            },
            rawMessage:
              '[2,"19223201","MeterValues",{"evseId":1,"meterValue":[{"timestamp":"2025-03-25T12:00:00Z","sampledValue":[{"value":150.0,"context":"Sample.Periodic","measurand":"Power.Active.Export"}]}]}]',
          },
          {
            id: "log3",
            messageId: "123457",
            messageType: "StartTransactionRequest",
            direction: "incoming",
            timestamp: "2025-03-25T09:30:00Z",
            action: "StartTransaction",
            stationId: "STATION002",
            chargerId: "CHARGER003",
            summary: "거래 시작: TAG001",
            payload: {
              connectorId: 1,
              idTag: "TAG001",
              timestamp: "2025-03-25T09:30:00Z",
              meterStart: 1000,
            },
            rawMessage:
              '[2,"123457","StartTransactionRequest",{"connectorId":1,"idTag":"TAG001","timestamp":"2025-03-25T09:30:00Z","meterStart":1000}]',
          },
          {
            id: "log4",
            messageId: "19223202",
            messageType: "StartTransaction",
            direction: "outgoing",
            timestamp: "2025-03-25T09:30:05Z",
            action: "StartTransaction",
            stationId: "STATION002",
            chargerId: "CHARGER003",
            summary: "거래 시작 응답: 승인됨",
            payload: {
              transactionId: 12345,
              idTagInfo: {
                status: "Accepted",
              },
            },
            rawMessage: '[2,"19223202","StartTransaction",{"transactionId":12345,"idTagInfo":{"status":"Accepted"}}]',
          },
          {
            id: "log5",
            messageId: "123458",
            messageType: "StopTransactionRequest",
            direction: "incoming",
            timestamp: "2025-03-25T11:45:00Z",
            action: "StopTransaction",
            stationId: "STATION003",
            chargerId: "CHARGER004",
            summary: "거래 종료: ID 12345",
            payload: {
              transactionId: 12345,
              timestamp: "2025-03-25T11:45:00Z",
              meterStop: 1150,
              reason: "Local",
            },
            rawMessage:
              '[2,"123458","StopTransactionRequest",{"transactionId":12345,"timestamp":"2025-03-25T11:45:00Z","meterStop":1150,"reason":"Local"}]',
          },
          {
            id: "log6",
            messageId: "19223203",
            messageType: "StopTransaction",
            direction: "outgoing",
            timestamp: "2025-03-25T11:45:05Z",
            action: "StopTransaction",
            stationId: "STATION003",
            chargerId: "CHARGER004",
            summary: "거래 종료 응답: 승인됨",
            payload: {
              idTagInfo: {
                status: "Accepted",
              },
            },
            rawMessage: '[2,"19223203","StopTransaction",{"idTagInfo":{"status":"Accepted"}}]',
          },
        ],
        page: 0,
        size: 10,
        totalElements: 6,
        totalPages: 1,
      },
    }
  }
}

// 로그 메시지에서 요약 생성
function generateSummary(log: OcppMessage): string {
  const { action, direction, payload } = log

  if (action === "MeterValues") {
    if (payload.meterValue && payload.meterValue.length > 0) {
      const meterValue = payload.meterValue[0]
      if (meterValue.sampledValue && meterValue.sampledValue.length > 0) {
        const values = meterValue.sampledValue
          .map((sv) => `${sv.measurand || "Value"}: ${sv.value}${sv.unit ? " " + sv.unit : ""}`)
          .join(", ")
        return `미터 값: ${values}`
      }
    }
    return "미터 값"
  }

  if (action === "StatusNotification") {
    return `상태 알림: ${payload.status || "Unknown"}`
  }

  if (action === "Authorize") {
    return `인증 ${direction === "incoming" ? "요청" : "응답"}: ${payload.idTag || ""}`
  }

  if (action === "StartTransaction") {
    if (direction === "incoming") {
      return `거래 시작: ${payload.idTag || ""}`
    } else {
      return `거래 시작 응답: ${payload.idTagInfo?.status === "Accepted" ? "승인됨" : "거부됨"}`
    }
  }

  if (action === "StopTransaction") {
    if (direction === "incoming") {
      return `거래 종료: ID ${payload.transactionId || ""}`
    } else {
      return `거래 종료 응답: ${payload.idTagInfo?.status === "Accepted" ? "승인됨" : "거부됨"}`
    }
  }

  return `${action} ${direction === "incoming" ? "요청" : "응답"}`
}

/**
 * Fetches a single OCPP message log by its ID
 */
export async function fetchOcppLogById(logId: string): Promise<{ status: string; data: OcppMessage }> {
  try {
    console.log(`Fetching OCPP log with ID: ${logId}`)

    const url = `${API_BASE_URL}/v1/ocpp/logs/${logId}`

    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("OCPP log received:", data)

    // 응답 데이터에 summary 속성 추가
    const processedData = {
      ...data,
      data: {
        ...data.data,
        summary: generateSummary(data.data),
      },
    }

    return processedData
  } catch (error) {
    console.error("Error fetching OCPP log by ID:", error)

    // Return mock data in case of error (for development)
    const mockLog = {
      id: "log1",
      messageId: "123456",
      messageType: "MeterValuesRequest",
      direction: "incoming",
      timestamp: "2025-03-25T10:00:00Z",
      action: "MeterValues",
      stationId: "STATION001",
      chargerId: "CHARGER001",
      payload: {
        evseId: 1,
        meterValue: [
          {
            timestamp: "2025-03-25T10:00:00Z",
            sampledValue: [
              {
                value: 10.5,
                context: "Sample.Periodic",
                measurand: "Current.Import",
                phase: "L1",
                location: "Outlet",
              },
              {
                value: 220.0,
                context: "Sample.Periodic",
                measurand: "Voltage",
                phase: "L1",
                location: "Outlet",
              },
            ],
          },
        ],
      },
      rawMessage:
        '[2,"123456","MeterValuesRequest",{"evseId":1,"meterValue":[{"timestamp":"2025-03-25T10:00:00Z","sampledValue":[{"value":10.5,"context":"Sample.Periodic","measurand":"Current.Import","phase":"L1","location":"Outlet"},{"value":220.0,"context":"Sample.Periodic","measurand":"Voltage","phase":"L1","location":"Outlet"}]}]}]',
    }

    return {
      status: "success",
      data: {
        ...mockLog,
        summary: generateSummary(mockLog as OcppMessage),
      } as OcppMessage,
    }
  }
}
