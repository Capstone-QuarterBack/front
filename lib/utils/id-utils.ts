/**
 * 간단한 고유 ID를 생성하는 함수
 * @returns 고유 ID 문자열
 */
export function generateId(): string {
  // 현재 시간을 밀리초로 변환하여 기본값으로 사용
  const timestamp = Date.now().toString(36);

  // 랜덤 문자열 생성
  const randomPart = Math.random().toString(36).substring(2, 10);

  // 두 값을 조합하여 고유 ID 생성
  return `${timestamp}-${randomPart}`;
}
