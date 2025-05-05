// 테마 관련 상수 정의

export const COLORS = {
  // 기본 색상
  primary: "#F59E0B", // 주 색상 (차트 등에 사용)
  success: "#10B981", // 성공/긍정적 상태
  danger: "#EF4444", // 위험/부정적 상태
  neutral: "#71717A", // 중립적 상태

  // 배경 색상
  background: {
    page: "#18181B", // 페이지 배경
    card: "#27272A", // 카드 배경
    sidebar: "#18181B", // 사이드바 배경
    hover: "#3F3F46", // 호버 배경
    active: "#3F3F46", // 활성 상태 배경
  },

  // 테두리 색상
  border: {
    default: "#3F3F46", // 기본 테두리
    light: "#52525B", // 밝은 테두리
  },

  // 텍스트 색상
  text: {
    primary: "#FFFFFF", // 기본 텍스트
    secondary: "#A1A1AA", // 보조 텍스트
    muted: "#71717A", // 흐린 텍스트
  },
}

export const SPACING = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
}

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export const COMPONENT_SIZES = {
  chart: {
    xs: "150px",
    sm: "180px",
    md: "220px",
    lg: "250px",
    xl: "300px",
  },
  sidebar: {
    collapsed: "60px",
    expanded: "200px",
  },
}
