// 충전소 상태에 따른 마커 이미지 URL 반환 (더 이상 사용하지 않지만 호환성을 위해 유지)
export function getMarkerImageByStatus(status: string): string {
  // 이 함수는 더 이상 사용하지 않지만 호환성을 위해 유지합니다
  return "";
}

// 충전소 상태에 따른 마커 색상 반환
export function getStatusColor(status: string): string {
  switch (status) {
    case "AVAILABLE":
    case "ACTIVE":
      return "#10B981"; // 초록색
    case "OCCUPIED":
    case "INACTIVE":
      return "#EF4444"; // 빨간색
    case "UNAVAILABLE":
    case "MAINTENANCE":
      return "#F59E0B"; // 노란색
    default:
      return "#71717A"; // 회색
  }
}

// 충전소 상태에 따른 텍스트 반환
export function getStatusText(status: string): string {
  switch (status) {
    case "AVAILABLE":
    case "ACTIVE":
      return "사용가능";
    case "OCCUPIED":
    case "INACTIVE":
      return "사용불가";
    case "UNAVAILABLE":
    case "MAINTENANCE":
      return "수리중";
    default:
      return "사용중지";
  }
}
