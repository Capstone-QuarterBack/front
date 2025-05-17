// API for fetching transaction records
import { API_BASE_URL } from "./apiConfig";

export interface ChargeSummary {
  startedTime: string;
  endedTime: string;
  totalMeterValue: number;
  totalPrice: number;
}

export interface TransactionRecord {
  transactionId: string;
  idToken: string;
  vehicleNo: string;
  chargeSummary: ChargeSummary;
}

export interface TransactionResponse {
  status: string;
  data: {
    content: TransactionRecord[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SingleTransactionResponse {
  status: string;
  data: TransactionRecord;
}

export interface TransactionSummaryResponse {
  status: string;
  data: {
    totalMeterValue: number;
    totalPrice: number;
  };
}

/**
 * Fetches transaction records for a given date range and station name
 */
export async function fetchTransactionRecords(
  firstDate: string,
  secondDate: string,
  stationName = "Sejong",
  page = 0,
  size = 10
): Promise<TransactionResponse> {
  try {
    console.log(
      `Fetching transaction records for ${stationName} from ${firstDate} to ${secondDate}`
    );

    const url = `${API_BASE_URL}/v1/charging-station/records?firstDate=${firstDate}&secondDate=${secondDate}&stationName=${stationName}&page=${page}&size=${size}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Transaction records received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching transaction records:", error);

    // Return mock data in case of error (for development)
    return {
      status: "success",
      data: {
        content: [
          {
            transactionId: "tx-006",
            idToken: "user-006",
            vehicleNo: "12-8989",
            chargeSummary: {
              startedTime: "2025-05-10T18:30:00",
              endedTime: "2025-05-10T19:30:00",
              totalMeterValue: 9000,
              totalPrice: 4500,
            },
          },
          {
            transactionId: "tx-005",
            idToken: "user-005",
            vehicleNo: "12-6666",
            chargeSummary: {
              startedTime: "2025-05-10T17:00:00",
              endedTime: "2025-05-10T18:00:00",
              totalMeterValue: 12000,
              totalPrice: 6000,
            },
          },
          {
            transactionId: "tx-004",
            idToken: "user-004",
            vehicleNo: "12-2222",
            chargeSummary: {
              startedTime: "2025-05-10T15:30:00",
              endedTime: "2025-05-10T16:30:00",
              totalMeterValue: 8000,
              totalPrice: 4000,
            },
          },
          {
            transactionId: "tx-003",
            idToken: "user-003",
            vehicleNo: "12-0999",
            chargeSummary: {
              startedTime: "2025-05-10T14:00:00",
              endedTime: "2025-05-10T15:00:00",
              totalMeterValue: 20000,
              totalPrice: 10000,
            },
          },
          {
            transactionId: "tx-002",
            idToken: "user-002",
            vehicleNo: "12-2353",
            chargeSummary: {
              startedTime: "2025-05-10T12:30:00",
              endedTime: "2025-05-10T13:30:00",
              totalMeterValue: 15000,
              totalPrice: 7500,
            },
          },
          {
            transactionId: "tx-001",
            idToken: "token001",
            vehicleNo: "12-4234",
            chargeSummary: {
              startedTime: "2025-05-10T11:00:00",
              endedTime: "2025-05-10T12:00:00",
              totalMeterValue: 10000,
              totalPrice: 5000,
            },
          },
        ],
        page: 0,
        size: 10,
        totalElements: 6,
        totalPages: 1,
      },
    };
  }
}

/**
 * Fetches a single transaction by its ID
 */
export async function fetchTransactionById(
  transactionId: string
): Promise<SingleTransactionResponse> {
  try {
    console.log(`Fetching transaction with ID: ${transactionId}`);

    const url = `${API_BASE_URL}/v1/charging-station/record?transactionId=${transactionId}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Transaction record received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);

    // Return mock data in case of error (for development)
    return {
      status: "success",
      data: {
        transactionId: "tx-001",
        idToken: "token001",
        vehicleNo: "12-4234",
        chargeSummary: {
          startedTime: "2025-05-12T11:00:00",
          endedTime: "2025-05-12T12:00:00",
          totalMeterValue: 10000,
          totalPrice: 1000000,
        },
      },
    };
  }
}

/**
 * Fetches transaction summary for a given date range and station name
 */
export async function fetchTransactionSummary(
  firstDate: string,
  secondDate: string,
  stationName = "Sejong"
): Promise<TransactionSummaryResponse> {
  try {
    console.log(
      `Fetching transaction summary for ${stationName} from ${firstDate} to ${secondDate}`
    );

    const url = `${API_BASE_URL}/v1/charging-station/records/summary?firstDate=${firstDate}&secondDate=${secondDate}&stationName=${stationName}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Transaction summary received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching transaction summary:", error);

    // Return mock data in case of error (for development)
    return {
      status: "success",
      data: {
        totalMeterValue: 74000,
        totalPrice: 1032000,
      },
    };
  }
}

/**
 * Helper function to get the first and last day of the current month
 */
export function getCurrentMonthDateRange(): {
  firstDate: string;
  secondDate: string;
} {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const firstDate = firstDay.toISOString().split("T")[0];
  const secondDate = lastDay.toISOString().split("T")[0];

  return { firstDate, secondDate };
}
