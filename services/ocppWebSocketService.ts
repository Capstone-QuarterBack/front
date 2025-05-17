// WebSocket 서비스 타입 정의
export interface OcppWebSocketMessage {
  id: string;
  messageId: string; // id와 동일한 값을 가지도록 추가
  timestamp: string;
  direction: "incoming" | "outgoing";
  messageType: string;
  action: string;
  stationId?: string;
  chargerId?: string;
  summary: string;
  rawData: any;
}

export class OcppWebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private messageListeners: ((message: OcppWebSocketMessage) => void)[] = [];
  private connectionChangeListeners: ((connected: boolean) => void)[] = [];
  private connectionErrorListeners: ((error: string) => void)[] = [];

  constructor(url?: string) {
    // 기본 WebSocket URL 설정 (환경 변수에서 가져오거나 기본값 사용)
    this.url =
      url ||
      process.env.NEXT_PUBLIC_OCPP_WEBSOCKET_URL ||
      "ws://localhost:8080/ocpp";
  }

  // WebSocket 연결
  connect() {
    try {
      if (
        this.socket &&
        (this.socket.readyState === WebSocket.OPEN ||
          this.socket.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.notifyConnectionChange(true);
      };

      this.socket.onclose = () => {
        this.notifyConnectionChange(false);
      };

      this.socket.onerror = (event) => {
        this.notifyConnectionError("WebSocket 연결 오류가 발생했습니다.");
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // OCPP 메시지 형식 변환
          const message: OcppWebSocketMessage = this.parseOcppMessage(data);

          this.notifyMessageListeners(message);
        } catch (error) {
          console.error("WebSocket 메시지 처리 오류:", error);
        }
      };
    } catch (error) {
      console.error("WebSocket 연결 생성 오류:", error);
      this.notifyConnectionError("WebSocket 연결을 생성할 수 없습니다.");
    }
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // 연결 상태 확인
  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
  }

  // 메시지 수신 이벤트 리스너 등록
  onMessage(listener: (message: OcppWebSocketMessage) => void) {
    this.messageListeners.push(listener);
  }

  // 메시지 수신 이벤트 리스너 제거
  offMessage(listener: (message: OcppWebSocketMessage) => void) {
    this.messageListeners = this.messageListeners.filter((l) => l !== listener);
  }

  // 연결 상태 변경 이벤트 리스너 등록
  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionChangeListeners.push(listener);
  }

  // 연결 상태 변경 이벤트 리스너 제거
  offConnectionChange(listener: (connected: boolean) => void) {
    this.connectionChangeListeners = this.connectionChangeListeners.filter(
      (l) => l !== listener
    );
  }

  // 연결 오류 이벤트 리스너 등록
  onConnectionError(listener: (error: string) => void) {
    this.connectionErrorListeners.push(listener);
  }

  // 연결 오류 이벤트 리스너 제거
  offConnectionError(listener: (error: string) => void) {
    this.connectionErrorListeners = this.connectionErrorListeners.filter(
      (l) => l !== listener
    );
  }

  // 메시지 리스너에게 알림
  private notifyMessageListeners(message: OcppWebSocketMessage) {
    this.messageListeners.forEach((listener) => listener(message));
  }

  // 연결 상태 변경 리스너에게 알림
  private notifyConnectionChange(connected: boolean) {
    this.connectionChangeListeners.forEach((listener) => listener(connected));
  }

  // 연결 오류 리스너에게 알림
  private notifyConnectionError(error: string) {
    this.connectionErrorListeners.forEach((listener) => listener(error));
  }

  // OCPP 메시지 파싱
  private parseOcppMessage(data: any): OcppWebSocketMessage {
    // OCPP 메시지 형식: [MessageTypeId, UniqueId, Action, Payload]
    const [messageTypeId, uniqueId, action, payload] = data;

    // 메시지 타입 결정
    let messageType = "Unknown";
    let direction: "incoming" | "outgoing" = "incoming";

    // MessageTypeId에 따른 메시지 타입 결정
    // 2: 요청, 3: 응답, 4: 오류
    switch (messageTypeId) {
      case 2:
        messageType = `${action}Request`;
        direction = "incoming";
        break;
      case 3:
        messageType = action;
        direction = "outgoing";
        break;
      case 4:
        messageType = "ErrorResponse";
        direction = "outgoing";
        break;
    }

    // 충전소 및 충전기 ID 추출 (payload에서 가능한 경우)
    let stationId = undefined;
    let chargerId = undefined;

    if (payload) {
      if (payload.stationId) {
        stationId = payload.stationId;
      }

      if (payload.chargerId || payload.evseId) {
        chargerId = payload.chargerId || `EVSE-${payload.evseId}`;
      }
    }

    // 메시지 요약 생성
    let summary = `${action} ${messageTypeId === 2 ? "요청" : "응답"}`;

    if (payload) {
      if (
        action === "MeterValues" &&
        payload.meterValue &&
        payload.meterValue.length > 0
      ) {
        const meterValue = payload.meterValue[0];
        if (meterValue.sampledValue && meterValue.sampledValue.length > 0) {
          const values = meterValue.sampledValue
            .map(
              (sv: any) =>
                `${sv.measurand || "Value"}: ${sv.value}${
                  sv.unit ? " " + sv.unit : ""
                }`
            )
            .join(", ");
          summary = `미터 값: ${values}`;
        }
      } else if (action === "StatusNotification" && payload.status) {
        summary = `상태 알림: ${payload.status}`;
      } else if (action === "Authorize" && payload.idTag) {
        summary = `인증 요청: ${payload.idTag}`;
      } else if (action === "StartTransaction" && payload.idTag) {
        summary = `거래 시작: ${payload.idTag}`;
      } else if (action === "StopTransaction" && payload.transactionId) {
        summary = `거래 종료: ID ${payload.transactionId}`;
      }
    }

    return {
      id: uniqueId,
      messageId: uniqueId, // id와 동일한 값 사용
      timestamp: new Date().toISOString(),
      direction,
      messageType,
      action,
      stationId,
      chargerId,
      summary,
      rawData: data,
    };
  }
}
