export interface StationOverviewData {
  stationId: string
  stationName: string
  latitude: number
  longitude: number
  status: string
}

export interface ChargerData {
  id: string
  status: string
  statusText: string
}

export interface UsageHistoryItem {
  startTime: string
  endTime: string
  usageKwh: number
  maxPower: number
  userType: string
  cardNumber: string
  carId: string
}

export interface ChargingHistoryItem {
  date: string
  time: string
  power: string
  price: string
  transactionId: string
}

export interface PriceHistoryItem {
  date: string
  time: string
  price: string
  change: string
}

export interface StationDetailData {
  chargeTime: string
  totalPower: string
  chargeEndTime: string
  maxPower: string
  cardNumber: string
  occupancyRate: string
  carId: string
  transactionId: string
  totalRevenue: string
}

export interface StationSummaryData {
  totalUsage: number
  totalPower: number
  totalRevenue: number
}

export interface MockDataType {
  batteryPercentage: number
  totalUsage: number
  totalPower: number
  totalRevenue: number
  chargers: ChargerData[]
  usageHistory: UsageHistoryItem[]
  chargingHistory: ChargingHistoryItem[]
  priceHistory: PriceHistoryItem[]
  stationDetails: StationDetailData
}
