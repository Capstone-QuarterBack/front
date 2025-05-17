// 날짜 관련 유틸리티 함수

/**
 * 문자열이나 다른 값을 안전하게 Date 객체로 변환합니다.
 * @param value Date 객체로 변환할 값
 * @returns Date 객체 또는 null (변환 실패 시)
 */
export function toDate(value: unknown): Date | null {
  if (value === null || value === undefined) {
    return null
  }

  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value
  }

  if (typeof value === "string") {
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date
    } catch (e) {
      return null
    }
  }

  if (typeof value === "number") {
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date
    } catch (e) {
      return null
    }
  }

  return null
}

/**
 * 날짜를 지정된 형식으로 포맷팅합니다.
 * @param value 포맷팅할 날짜, 날짜 문자열, 또는 타임스탬프
 * @param format 날짜 형식 (기본값: 'yyyy/MM/dd HH:mm:ss')
 * @param fallback 변환 실패 시 반환할 값 (기본값: '')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(value: unknown, format = "yyyy/MM/dd HH:mm:ss", fallback = ""): string {
  const date = toDate(value)
  if (!date) {
    return typeof value === "string" ? value : fallback
  }

  try {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0")

    let result = format
    result = result.replace(/yyyy/g, year.toString())
    result = result.replace(/MM/g, month)
    result = result.replace(/dd/g, day)
    result = result.replace(/HH/g, hours)
    result = result.replace(/mm/g, minutes)
    result = result.replace(/ss/g, seconds)
    result = result.replace(/SSS/g, milliseconds)

    return result
  } catch (error) {
    console.error("날짜 형식 변환 오류:", error)
    return typeof value === "string" ? value : fallback
  }
}

/**
 * ISO 형식의 날짜 문자열을 사용자 친화적인 형식으로 변환
 * @param isoString ISO 형식의 날짜 문자열 (예: "2025-05-04T18:28:07")
 * @param format 날짜 포맷 (기본값: "yyyy/MM/dd HH:mm")
 * @returns 사용자 친화적인 날짜 문자열 (예: "2025/05/04 18:28")
 */
export function formatISODate(isoString: string | null | undefined, format = "yyyy/MM/dd HH:mm"): string {
  if (!isoString) return ""
  return formatDate(isoString, format)
}

/**
 * 타임스탬프를 포맷팅하는 함수
 * @param timestamp 타임스탬프 문자열 또는 숫자
 * @param format 포맷 문자열 (기본값: "HH:mm:ss.SSS")
 * @returns 포맷팅된 타임스탬프 문자열
 */
export function formatTimestamp(timestamp: string | number | null | undefined, format = "HH:mm:ss.SSS"): string {
  if (timestamp === null || timestamp === undefined) return ""
  return formatDate(timestamp, format)
}

/**
 * 날짜를 상대적인 시간으로 표시 (예: "3분 전", "2시간 전")
 * @param value 날짜, 날짜 문자열, 또는 타임스탬프
 * @returns 상대적인 시간 문자열
 */
export function getRelativeTime(value: unknown): string {
  const date = toDate(value)
  if (!date) {
    return typeof value === "string" ? value : ""
  }

  try {
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
    return typeof value === "string" ? value : ""
  }
}
