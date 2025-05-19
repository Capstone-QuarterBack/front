// API for fetching transaction records
import { API_BASE_URL } from "./apiConfig"

export interface ChargeSummary {
  startedTime: string
  endedTime: string
  totalMeterValue: number
  totalPrice: number
}

export interface TransactionRecord {
  transactionId: string
  idToken: string
  vehicleNo: string
  chargeSummary: ChargeSummary
}

export interface TransactionResponse {
  status: string
  data: {
    content: TransactionRecord[]
    page: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export interface SingleTransactionResponse {
  status: string
  data: TransactionRecord
}

export interface TransactionSummaryResponse {
  status: string
  data: {
    totalMeterValue: number // This is actually the discharge amount
    totalPrice: number
  }
}

/**
 * Fetches transaction records for a given date range and station name
 */
export async function fetchTransactionRecords(
  firstDate: string,
  secondDate: string,
  stationName = "Sejong",
  page = 0,
  size = 10,
): Promise<TransactionResponse> {
  try {
    console.log(`Fetching transaction records for ${stationName} from ${firstDate} to ${secondDate}`)

    const url = `${API_BASE_URL}/v1/charging-station/records?firstDate=${firstDate}&secondDate=${secondDate}&stationName=${stationName}&page=${page}&size=${size}`

    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    // Handle 404 and other error responses
    if (response.status === 404) {
      console.log("No records found (404 response)")
      return {
        status: "success",
        data: {
          content: [],
          page: 0,
          size: size,
          totalElements: 0,
          totalPages: 0,
        },
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("Transaction records received:", data)

    return data
  } catch (error) {
    console.error("Error fetching transaction records:", error)
    // Return empty data instead of mock data
    return {
      status: "success",
      data: {
        content: [],
        page: 0,
        size: size,
        totalElements: 0,
        totalPages: 0,
      },
    }
  }
}

/**
 * Fetches a single transaction by its ID
 */
export async function fetchTransactionById(transactionId: string): Promise<SingleTransactionResponse> {
  try {
    console.log(`Fetching transaction with ID: ${transactionId}`)

    const url = `${API_BASE_URL}/v1/charging-station/record?transactionId=${transactionId}`

    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    // Handle 404 and other error responses
    if (response.status === 404) {
      console.log("Transaction not found (404 response)")
      throw new Error("Transaction not found")
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("Transaction record received:", data)

    return data
  } catch (error) {
    console.error("Error fetching transaction by ID:", error)
    // Return empty data instead of mock data
    throw error
  }
}

/**
 * Fetches transaction summary for a given date range and station name
 */
export async function fetchTransactionSummary(
  firstDate: string,
  secondDate: string,
  stationName = "Sejong",
): Promise<TransactionSummaryResponse> {
  try {
    console.log(`Fetching transaction summary for ${stationName} from ${firstDate} to ${secondDate}`)

    const url = `${API_BASE_URL}/v1/charging-station/records/summary?firstDate=${firstDate}&secondDate=${secondDate}&stationName=${stationName}`

    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    // Handle 404 and other error responses
    if (response.status === 404) {
      console.log("No summary found (404 response)")
      return {
        status: "success",
        data: {
          totalMeterValue: 0,
          totalPrice: 0,
        },
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("Transaction summary received:", data)

    return data
  } catch (error) {
    console.error("Error fetching transaction summary:", error)
    // Return empty data instead of mock data
    return {
      status: "success",
      data: {
        totalMeterValue: 0,
        totalPrice: 0,
      },
    }
  }
}

// Add the function to fetch charging station names
export async function fetchChargingStationNames(): Promise<{ status: string; data: string[] }> {
  try {
    console.log("Fetching charging station names")

    const url = `${API_BASE_URL}/v1/charging-station/names`
    console.log(`API Request URL: ${url}`)

    const response = await fetch(url)

    // Handle 404 and other error responses
    if (response.status === 404) {
      console.log("No charging stations found (404 response)")
      return {
        status: "success",
        data: [],
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.status}, ${errorText}`)
    }

    const data = await response.json()
    console.log("Charging station names received:", data)

    return data
  } catch (error) {
    console.error("Error fetching charging station names:", error)
    // Return empty data instead of mock data
    return {
      status: "success",
      data: [],
    }
  }
}

/**
 * Helper function to get the first and last day of the current month
 */
export function getCurrentMonthDateRange(): {
  firstDate: string
  secondDate: string
} {
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const firstDate = firstDay.toISOString().split("T")[0]
  const secondDate = lastDay.toISOString().split("T")[0]

  return { firstDate, secondDate }
}

// Update the getCurrentMonthDateRange function to provide a wider default date range
export function getDefaultDateRange(): {
  firstDate: string
  secondDate: string
} {
  // Set a wide default date range (from beginning of 2025 to mid-2026)
  return {
    firstDate: "2025-01-01",
    secondDate: "2026-06-06",
  }
}
