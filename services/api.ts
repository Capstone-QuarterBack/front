// services/api.ts

import { API_BASE_URL } from "./apiConfig";  // API_BASE_URL만 import

// 응답 타입들
export interface DischargeByHourData { hour: number; dischargeKwh: number; }
export interface ChargerUsageData { timestamp: string; chargerLocation: string; chargerNumber: string; usage: string; price: string; transactionId: string; }
export interface DailySummaryData { usage: number; profit: number; discharge: number; }
export interface StationData { stationId: string; stationName: string; address: string; stationStatus: string; regDate: string; totalChargers: number; avaliableCount: number; occupiedCount: number; unAvaliableCount: number; }
export interface StationOverviewData { stationId: string; stationName: string; latitude: number; longitude: number; status: string; }
export interface Transaction { id: string; stationName: string; category: string; type: string; startTime: string; endTime: string; transactionId: string; userId: string; vehicleInfo: string; amount: string; profit: string; }

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API 기본 설정 (Base URL만 apiConfig.ts에서 가져오니까 여기 필요 없음)

// api 요청 함수
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw new Error("API 요청 시간 초과");
    }
    throw error;
  }
}

// 각각의 API 함수들

export async function fetchDischargeByHour(): Promise<DischargeByHourData[]> {
  return await apiRequest<DischargeByHourData[]>("/dashboard/discharge-by-hour");
}

export async function fetchChargerUsage(): Promise<ChargerUsageData[]> {
  return await apiRequest<ChargerUsageData[]>("/dashboard/chargers/usage");
}

export async function fetchDailySummary(): Promise<DailySummaryData> {
  return await apiRequest<DailySummaryData>("/dashboard/summary");
}

export async function fetchStations(): Promise<StationData[]> {
  return await apiRequest<StationData[]>("/dashboard/stations");
}

export async function fetchStationOverview(): Promise<StationOverviewData[]> {
  return await apiRequest<StationOverviewData[]>("/overview/stations");
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return await apiRequest<Transaction[]>("/transactions");
}

export async function fetchCongestionData(): Promise<any> {
  return await apiRequest<any>("/congestion");
}
