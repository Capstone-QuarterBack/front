// 충전소 상태에 따른 색상 및 텍스트
export function getStatusInfo(status: string) {
  switch (status) {
    case "AVAILABLE":
      return { color: "bg-green-500", text: "사용가능" }
    case "OCCUPIED":
      return { color: "bg-amber-500", text: "이용중" }
    case "UNAVAILABLE":
      return { color: "bg-red-500", text: "사용불가" }
    default:
      return { color: "bg-black", text: "사용중지" }
  }
}

// 충전기 상태에 따른 색상 반환
export function getChargerStatusColor(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500"
    case "OCCUPIED":
      return "bg-amber-500"
    case "UNAVAILABLE":
      return "bg-red-500"
    default:
      return "bg-black"
  }
}
