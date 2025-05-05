// 충전기 상태 정보 타입
export interface ChargerStatusInfo {
  evseId: number
  chargerStatus: string // "AVAILABLE" | "OCCUPIED" | "UNAVAILABLE"
}

// 충전기 정보 응답 타입 (available/occupied/unavailable 공통)
export interface ChargerInfoResponse {
  usages: ChargerUsage[]
  currentPage: number
  totalPages: number
  totalElements: number
}

// 충전기 사용 내역 타입
export interface ChargerUsage {
  chargeStartTime: string
  chargeEndTime: string
  chargedEnergy: number
  price: number
  carNumber: string
  chargerModel: string
  approvalNumber: string
  errorCode: string
}

// 사용 중인 충전기 정보 응답 타입 (필요시 추가)
export type InUseChargerResponse = {}
