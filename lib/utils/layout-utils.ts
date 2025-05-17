// 레이아웃 관련 유틸리티 함수

import { cn } from "@/lib/utils"

// 화면 비율을 유지하는 컨테이너 클래스 생성
export function getAspectRatioClass(ratio = "16/9") {
  return `relative w-full pb-[calc(100%/(${ratio}))]`
}

// 비율 유지 컨테이너 내부 콘텐츠 클래스
export const aspectRatioContentClass = "absolute inset-0 w-full h-full"

// 그리드 아이템 클래스 생성 (반응형)
export function getGridItemClass(config: {
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

// 최대 너비 제한 클래스 생성
export function getMaxWidthClass(maxWidth = "1920px") {
  return `max-w-[${maxWidth}] mx-auto`
}

// 컨테이너 높이 클래스 생성
export function getContainerHeightClass(height = "auto") {
  return `h-[${height}]`
}
