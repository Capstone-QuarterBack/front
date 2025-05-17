// 숫자 관련 유틸리티 함수

/**
 * 숫자를 천 단위 구분자가 있는 형식으로 변환
 * @param value 변환할 숫자 또는 숫자 문자열
 * @returns 천 단위 구분자가 있는 문자열
 */
export function formatNumber(value: number | string): string {
  try {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return num.toLocaleString("ko-KR")
  } catch (error) {
    console.error("숫자 형식 변환 오류:", error)
    return String(value) // 오류 발생 시 원래 값을 문자열로 반환
  }
}

/**
 * 숫자를 통화 형식으로 변환
 * @param value 변환할 숫자 또는 숫자 문자열
 * @param currency 통화 코드 (기본값: 'KRW')
 * @returns 통화 형식 문자열
 */
export function formatCurrency(value: number | string, currency = "KRW"): string {
  try {
    const num = typeof value === "string" ? Number.parseFloat(value) : value
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(num)
  } catch (error) {
    console.error("통화 형식 변환 오류:", error)
    return String(value) // 오류 발생 시 원래 값을 문자열로 반환
  }
}

/**
 * 숫자를 단위와 함께 표시 (예: 1000 -> 1K, 1000000 -> 1M)
 * @param value 변환할 숫자
 * @returns 단위가 포함된 문자열
 */
export function formatCompactNumber(value: number): string {
  try {
    return new Intl.NumberFormat("ko-KR", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  } catch (error) {
    console.error("간결한 숫자 형식 변환 오류:", error)
    return String(value) // 오류 발생 시 원래 값을 문자열로 반환
  }
}
