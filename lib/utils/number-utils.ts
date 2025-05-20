/**
 * 숫자를 천 단위 구분자가 있는 형식으로 변환합니다.
 * @param value 변환할 숫자
 * @param decimalPlaces 소수점 자릿수 (기본값: 0)
 * @returns 형식이 지정된 문자열
 */
export function formatNumber(value: number, decimalPlaces = 0): string {
  // 소수점 자릿수 적용
  const fixedValue = decimalPlaces > 0 ? value.toFixed(decimalPlaces) : value.toString()

  // 천 단위 구분자 추가
  return fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * 숫자를 원화 형식으로 변환합니다.
 * @param value 변환할 숫자
 * @returns 원화 형식의 문자열
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * 숫자를 백분율 형식으로 변환합니다.
 * @param value 변환할 숫자 (0-1 사이)
 * @returns 백분율 형식의 문자열
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * 숫자를 kWh 형식으로 변환합니다.
 * @param value 변환할 숫자
 * @returns kWh 형식의 문자열
 */
export function formatEnergy(value: number): string {
  return `${formatNumber(value, 2)} kWh`
}

/**
 * 숫자를 kW 형식으로 변환합니다.
 * @param value 변환할 숫자
 * @returns kW 형식의 문자열
 */
export function formatPower(value: number): string {
  return `${formatNumber(value, 2)} kW`
}
