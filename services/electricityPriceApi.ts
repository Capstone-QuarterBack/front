import { API_BASE_URL } from "./apiConfig"
/**
 * 전기 가격 관련 API 서비스
 */

// 한국 전력공사 가격 응답 타입
export interface KepcoPrice {
    kepcoPrice: number
  }
  
  // 충전소 가격 응답 타입
  export interface CsPrice {
    csPrice: number
    updateTime: string
  }
  
  /**
   * 한국 전력공사 가격 조회
   * @returns 한국 전력공사 가격 정보
   */
  export async function fetchKepcoPrice(): Promise<KepcoPrice> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/electricity-price/kepco-price`)
      if (!response.ok) {
        throw new Error("Failed to fetch KEPCO price")
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching KEPCO price:", error)
      return { kepcoPrice: 0.09 } // 기본값
    }
  }
  
  /**
   * 충전소 가격 조회
   * @returns 충전소 가격 정보 리스트
   */
  export async function fetchCsPrice(): Promise<CsPrice[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/electricity-price/cs-price`)
      if (!response.ok) {
        throw new Error("Failed to fetch CS price")
      }
      const data = await response.json()
      console.log("API Response:", data) // 디버깅용 로그
      return data
    } catch (error) {
      console.error("Error fetching CS price:", error)
      // 기본값 (테스트용)
      return [
        {
          csPrice: 61,
          updateTime: new Date().toISOString(),
        },
        {
          csPrice: 15,
          updateTime: new Date(Date.now() - 20000).toISOString(),
        },
        {
          csPrice: 153,
          updateTime: new Date(Date.now() - 24000).toISOString(),
        },
        {
          csPrice: 153,
          updateTime: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          csPrice: 100,
          updateTime: new Date(Date.now() - 86400000 * 4).toISOString(),
        },
      ]
    }
  }
  