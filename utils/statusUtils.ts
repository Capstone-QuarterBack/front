// 충전소 상태에 따른 색상 및 텍스트
export function getStatusInfo(status: string) {
  switch (status) {
    case "ACTIVE":
      return { color: "bg-green-500", text: "사용가능" }
    case "INACTIVE":
      return { color: "bg-red-500", text: "사용중" }
    case "MAINTENANCE":
      return { color: "bg-yellow-500", text: "수리중" }
    default:
      return { color: "bg-black", text: "사용중지" }
  }
}

// 충전기 상태에 따른 색상 반환
export function getChargerStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500"
    case "INACTIVE":
      return "bg-red-500"
    case "MAINTENANCE":
      return "bg-yellow-500"
    default:
      return "bg-black"
  }
}
