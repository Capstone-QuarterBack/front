// 날짜 관련 유틸리티 함수

/**
 * ISO 형식의 날짜 문자열을 사용자 친화적인 형식으로 변환
 * @param isoString ISO 형식의 날짜 문자열 (예: "2025-05-04T18:28:07")
 * @returns 사용자 친화적인 날짜 문자열 (예: "2025/05/04 18:28")
 */
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString)

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return isoString // 유효하지 않은 경우 원래 문자열 반환
    }

    // 날짜 형식 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}/${month}/${day} ${hours}:${minutes}`
  } catch (error) {
    console.error("날짜 형식 변환 오류:", error)
    return isoString // 오류 발생 시 원래 문자열 반환
  }
}

/**
 * 날짜를 상대적인 시간으로 표시 (예: "3분 전", "2시간 전")
 * @param isoString ISO 형식의 날짜 문자열
 * @returns 상대적인 시간 문자열
 */
export function getRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()

    // 시간 차이 계산
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    // 상대적인 시간 반환
    if (diffDay > 0) {
      return `${diffDay}일 전`
    } else if (diffHour > 0) {
      return `${diffHour}시간 전`
    } else if (diffMin > 0) {
      return `${diffMin}분 전`
    } else {
      return "방금 전"
    }
  } catch (error) {
    console.error("상대적 시간 계산 오류:", error)
    return isoString // 오류 발생 시 원래 문자열 반환
  }
}
