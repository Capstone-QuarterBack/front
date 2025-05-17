import { COLORS } from "../constants/theme"
import { cn } from "@/lib/utils"

// 컴포넌트 타입별 기본 스타일 정의
export const componentStyles = {
  // 카드 컴포넌트 스타일
  card: "bg-zinc-800 rounded-lg p-3 md:p-4 h-full",

  // 카드 헤더 스타일
  cardHeader: "flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-2",

  // 카드 제목 스타일
  cardTitle: "text-sm font-medium",

  // 차트 컨테이너 스타일
  chartContainer: "h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] relative",

  // 테이블 컨테이너 스타일
  tableContainer: "h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px] overflow-auto",

  // 테이블 헤더 스타일
  tableHeader: "sticky top-0 bg-zinc-800 z-10 text-zinc-400 border-b border-zinc-700",

  // 테이블 셀 스타일
  tableCell: "py-2 text-xs px-2 whitespace-nowrap",

  // 사이드바 스타일
  sidebar: "border-r border-zinc-800 flex flex-col transition-all duration-300",

  // 사이드바 로고 영역 스타일
  sidebarLogo: "p-4 border-b border-zinc-800 flex items-center justify-center",

  // 사이드바 메뉴 스타일
  sidebarMenu: "px-3 py-2 text-xs font-medium text-zinc-500",

  // 버튼 스타일
  button: "p-2 bg-zinc-700 hover:bg-zinc-600 rounded text-xs flex items-center justify-center",

  // 입력 필드 스타일
  input: "pl-8 h-8 bg-zinc-700 border-zinc-600 text-sm",
}

// 상태에 따른 스타일 생성 함수
export function getStatusStyle(isPositive: boolean) {
  return {
    color: isPositive ? COLORS.success : COLORS.danger,
    borderColor: isPositive ? COLORS.success : COLORS.danger,
    textColor: isPositive ? "text-green-500" : "text-red-500",
    borderClass: isPositive ? "border-green-500" : "border-red-500",
  }
}

// 반응형 그리드 클래스 생성 함수
export function getResponsiveGridClass(config: {
  base?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
}) {
  const { base = 1, sm, md, lg, xl } = config

  return cn(
    `col-span-${base}`,
    sm && `sm:col-span-${sm}`,
    md && `md:col-span-${md}`,
    lg && `lg:col-span-${lg}`,
    xl && `xl:col-span-${xl}`,
  )
}

// 로딩 상태 스타일
export const loadingStyles = {
  container: "absolute inset-0 flex items-center justify-center",
  spinner: "animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500",
}

// 에러 상태 스타일
export const errorStyles = {
  container: "absolute inset-0 flex items-center justify-center text-red-500",
}
