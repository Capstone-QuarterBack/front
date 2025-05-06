// 충전기 상태 정보 타입
export interface ChargerStatusInfo {
  evseId: number
  chargerStatus: string // "AVAILABLE" | "OCCUPIED" | "UNAVAILABLE"
}

// 충전기 정보 응답 타입 (available/occupied/unavailable 공통)
export interface ChargerInfoResponse {
  totalChargedEnergy: number
  totalVehicleCount: number
  totalRevenue: number
  chargedEnergyDiffPercent: number
  vehicleCountDiffPercent: number
  revenueDiffPercent: number
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

// 충전 시간대 정보 타입 (혼잡도)
export interface CongestionData {
  hour: number
  count: number
  isPeak: boolean
}

// ESS 배터리 상태 및 충전 이력 응답 타입
export interface ChargingHistoryResponse {
  stationName: string
  essValue: string | null
  records: ChargingRecord[]
  page: number
  size: number
  totalPages: number
  totalElements: number
  last: boolean
}

// 충전 이력 레코드 타입
export interface ChargingRecord {
  startTime: string
  endTime: string
  priceKRW: number
  transactionId: string
}

// 사용 중인 충전기 정보 응답 타입 (필요시 추가)
export type InUseChargerResponse = {}
