// 카카오맵 관련 유틸리티 함수

/**
 * 카카오맵 API가 로드되었는지 확인하고, 로드되지 않았다면 로드를 기다립니다.
 * @returns Promise<void> - 카카오맵 API가 로드되면 resolve됩니다.
 */
export function ensureKakaoMapLoaded(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      resolve()
      return
    }

    // 스크립트가 로드 중인 경우
    const script = document.getElementById("kakao-map-script") as HTMLScriptElement
    if (script) {
      script.addEventListener("load", () => {
        // 카카오맵 API 초기화
        window.kakao.maps.load(() => {
          console.log("카카오맵 API 초기화 완료")
          resolve()
        })
      })
      script.addEventListener("error", (error) => {
        console.error("카카오맵 스크립트 로드 오류:", error)
        reject(new Error("카카오맵 스크립트 로드 실패"))
      })
      return
    }

    // 스크립트가 없는 경우
    reject(new Error("카카오맵 스크립트를 찾을 수 없습니다."))
  })
}

/**
 * 충전소 상태에 따른 마커 이미지 URL 반환
 * @param status 충전소 상태
 * @returns 마커 이미지 URL
 */
export function getMarkerImageByStatus(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerGreen.png"
    case "INACTIVE":
      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerRed.png"
    case "MAINTENANCE":
      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerYellow.png"
    default:
      return "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_black.png"
  }
}

/**
 * 충전소 상태에 따른 텍스트 색상 반환
 * @param status 충전소 상태
 * @returns 텍스트 색상 (HEX 코드)
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "#10B981" // green-500
    case "INACTIVE":
      return "#EF4444" // red-500
    case "MAINTENANCE":
      return "#F59E0B" // amber-500
    default:
      return "#71717A" // zinc-400
  }
}

/**
 * 충전소 상태에 따른 텍스트 반환
 * @param status 충전소 상태
 * @returns 상태 텍스트
 */
export function getStatusText(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "사용가능"
    case "INACTIVE":
      return "사용중"
    case "MAINTENANCE":
      return "수리중"
    default:
      return "사용중지"
  }
}
