import type { ChartData, PieChartData, StatisticsData } from "@/types/chart";

// 막대 그래프용 데이터 생성
export function generateBarChartData(): ChartData[] {
  return Array(12)
    .fill(0)
    .map((_, i) => ({
      x: i + 1, // 1-12월
      y: Math.floor(Math.random() * 5000) + 1000, // 1000-6000 사이의 값
    }));
}

// 선 그래프용 데이터 생성
export function generateLineChartData(): ChartData[] {
  return Array(24)
    .fill(0)
    .map((_, i) => ({
      x: i, // 0-23시
      y: Math.floor(Math.random() * 100) + 20, // 20-120 사이의 값
    }));
}

// 원형 그래프용 데이터 생성
export function generatePieChartData(): PieChartData[] {
  const categories = [
    { label: "충전소 A", color: "#4CAF50" },
    { label: "충전소 B", color: "#2196F3" },
    { label: "충전소 C", color: "#FFC107" },
    { label: "충전소 D", color: "#9E9E9E" },
  ];

  return categories.map((cat) => ({
    ...cat,
    value: Math.floor(Math.random() * 100) + 10, // 10-110 사이의 값
  }));
}

// 비용 관련 데이터
export function generateCostData(): StatisticsData {
  return {
    barChartData: Array(12)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 8000) + 2000, // 월별 비용 (2000-10000)
      })),
    lineChartData: Array(30)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 500) + 100, // 일별 비용 (100-600)
      })),
    pieChartData: [
      { label: "충전소 A", value: 45, color: "#4CAF50" },
      { label: "충전소 B", value: 25, color: "#2196F3" },
      { label: "충전소 C", value: 20, color: "#FFC107" },
      { label: "충전소 D", value: 10, color: "#9E9E9E" },
    ],
  };
}

// 충전량 관련 데이터
export function generateChargingVolumeData(): StatisticsData {
  return {
    barChartData: Array(12)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 10000) + 5000, // 월별 충전량 (5000-15000 kWh)
      })),
    lineChartData: Array(24)
      .fill(0)
      .map((_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 200) + 50, // 시간별 충전량 (50-250 kWh)
      })),
    pieChartData: [
      { label: "주간 (06-18시)", value: 65, color: "#4CAF50" },
      { label: "야간 (18-06시)", value: 35, color: "#2196F3" },
    ],
  };
}

// 충전 정보 관련 데이터
export function generateChargingInfoData(): StatisticsData {
  return {
    barChartData: Array(7)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 200) + 50, // 요일별 충전 횟수 (50-250)
      })),
    lineChartData: Array(24)
      .fill(0)
      .map((_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 30) + 5, // 시간별 충전 횟수 (5-35)
      })),
    pieChartData: [
      { label: "정상 완료", value: 75, color: "#4CAF50" },
      { label: "중단됨", value: 15, color: "#FFC107" },
      { label: "오류 발생", value: 10, color: "#F44336" },
    ],
  };
}

// 충전기 상태 관련 데이터
export function generateChargerStatusData(): StatisticsData {
  return {
    barChartData: Array(5)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 50) + 10, // 충전기별 고장 횟수 (10-60)
      })),
    lineChartData: Array(12)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 10) + 90, // 월별 가동률 (90-100%)
      })),
    pieChartData: [
      { label: "사용 가능", value: 70, color: "#4CAF50" },
      { label: "사용 중", value: 20, color: "#2196F3" },
      { label: "점검 중", value: 7, color: "#FFC107" },
      { label: "고장", value: 3, color: "#F44336" },
    ],
  };
}

// 전력 거래 관련 데이터
export function generatePowerTradingData(): StatisticsData {
  return {
    barChartData: Array(12)
      .fill(0)
      .map((_, i) => ({
        x: i + 1,
        y: Math.floor(Math.random() * 15000) + 5000, // 월별 거래량 (5000-20000 kWh)
      })),
    lineChartData: Array(24)
      .fill(0)
      .map((_, i) => ({
        x: i,
        y: Math.floor(Math.random() * 300) + 100, // 시간별 거래량 (100-400 kWh)
      })),
    pieChartData: [
      { label: "구매", value: 60, color: "#4CAF50" },
      { label: "판매", value: 40, color: "#F44336" },
    ],
  };
}
