// API for user management
import { API_BASE_URL } from "./apiConfig";
export interface Customer {
  customerId: string;
  customerName: string;
  idToken: string;
  vehicleNo: string;
  registrationDate: string;
}

export interface CustomerResponse {
  customerList: Customer[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface CustomerChargedLog {
  startedTime: string;
  endedTime: string;
  vehicleNo: string;
  transactionId: string;
  totalMeterValue: number;
  totalPrice: number;
}

export interface CustomerChargedLogResponse {
  customerChargedLogList: CustomerChargedLog[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

export interface CustomerUpdateData {
  customerName: string;
  phoneNumber?: string;
  email?: string;
  vehicleNo: string;
}

export interface CustomerUpdateResponse {
  customerId: string;
}

/**
 * Fetches customer list with pagination
 */
export async function fetchCustomers(
  page = 0,
  size = 10,
  sortDir = "desc"
): Promise<CustomerResponse> {
  try {
    console.log(
      `Fetching customers (page: ${page}, size: ${size}, sortDir: ${sortDir})`
    );

    const url = `${API_BASE_URL}/managing/customer/customers?page=${page}&size=${size}&sortDir=${sortDir}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Customer data received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);

    // Return mock data in case of error (for development)
    return {
      customerList: [
        {
          customerId: "user6",
          customerName: "이름6",
          idToken: "user-006",
          vehicleNo: "12-8989",
          registrationDate: "2024-05-25T16:30:00",
        },
        {
          customerId: "user5",
          customerName: "이름5",
          idToken: "user-005",
          vehicleNo: "12-6666",
          registrationDate: "2024-05-24T16:30:00",
        },
        {
          customerId: "user4",
          customerName: "이름4",
          idToken: "user-004",
          vehicleNo: "12-2222",
          registrationDate: "2024-05-23T16:30:00",
        },
        {
          customerId: "user3",
          customerName: "이름3",
          idToken: "user-003",
          vehicleNo: "12-0999",
          registrationDate: "2024-05-22T16:30:00",
        },
        {
          customerId: "user2",
          customerName: "이름2",
          idToken: "user-002",
          vehicleNo: "12-2353",
          registrationDate: "2024-05-21T16:30:00",
        },
        {
          customerId: "user1",
          customerName: "이름1",
          idToken: "token001",
          vehicleNo: "12-4234",
          registrationDate: "2024-05-20T16:30:00",
        },
      ],
      currentPage: 0,
      totalPages: 1,
      totalElements: 6,
    };
  }
}

/**
 * Fetches customer charged logs
 */
export async function fetchCustomerChargedLogs(
  customerId: string,
  page = 0,
  size = 10
): Promise<CustomerChargedLogResponse> {
  try {
    console.log(
      `Fetching charged logs for customer ${customerId} (page: ${page}, size: ${size})`
    );

    const url = `${API_BASE_URL}/managing/customer/chargedLog/${customerId}?page=${page}&size=${size}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Customer charged logs received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching customer charged logs:", error);

    // Return mock data in case of error (for development)
    return {
      customerChargedLogList: [
        {
          startedTime: "2025-01-01T12:12:12",
          endedTime: "2025-01-01T12:42:12",
          vehicleNo: "GV-60",
          transactionId: "AGM-828910",
          totalMeterValue: 100102,
          totalPrice: 12345,
        },
        {
          startedTime: "2025-01-01T12:12:12",
          endedTime: "2025-01-01T12:42:12",
          vehicleNo: "GV-60",
          transactionId: "AGM-828910",
          totalMeterValue: 100102,
          totalPrice: 12345,
        },
        {
          startedTime: "2025-01-01T12:12:12",
          endedTime: "2025-01-01T12:42:12",
          vehicleNo: "GV-60",
          transactionId: "AGM-828910",
          totalMeterValue: 100102,
          totalPrice: 12345,
        },
      ],
      currentPage: 0,
      totalElements: 3,
      totalPages: 1,
    };
  }
}

/**
 * Fetches customer charged logs by date range
 */
export async function fetchCustomerChargedLogsByDateRange(
  customerId: string,
  startDate: string,
  endDate: string,
  page = 0,
  size = 10
): Promise<CustomerChargedLogResponse> {
  try {
    console.log(
      `Fetching charged logs for customer ${customerId} from ${startDate} to ${endDate} (page: ${page}, size: ${size})`
    );

    const url = `${API_BASE_URL}/managing/customer/chargedLog/${customerId}/search?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Customer charged logs by date range received:", data);

    return data;
  } catch (error) {
    console.error("Error fetching customer charged logs by date range:", error);

    // Return mock data in case of error (for development)
    return {
      customerChargedLogList: [
        {
          startedTime: "2025-01-01T12:12:12",
          endedTime: "2025-01-01T12:42:12",
          vehicleNo: "GV-60",
          transactionId: "AGM-828910",
          totalMeterValue: 100102,
          totalPrice: 12345,
        },
        {
          startedTime: "2025-01-01T12:12:12",
          endedTime: "2025-01-01T12:42:12",
          vehicleNo: "GV-60",
          transactionId: "AGM-828910",
          totalMeterValue: 100102,
          totalPrice: 12345,
        },
      ],
      currentPage: 0,
      totalElements: 2,
      totalPages: 1,
    };
  }
}

/**
 * Searches for customers based on search type and keyword
 */
export async function searchCustomers(
  searchType: string,
  keyword: string,
  page = 0,
  size = 10,
  sortDir = "desc"
): Promise<CustomerResponse> {
  try {
    console.log(
      `Searching customers (searchType: ${searchType}, keyword: ${keyword}, page: ${page}, size: ${size}, sortDir: ${sortDir})`
    );

    const url = `${API_BASE_URL}/managing/customer/customers/search?page=${page}&size=${size}&sortDir=${sortDir}&searchType=${searchType}&keyword=${keyword}`;

    console.log(`API Request URL: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status}, ${errorText}`);
    }

    const data = await response.json();
    console.log("Search results received:", data);

    return data;
  } catch (error) {
    console.error("Error searching customers:", error);

    // Return mock data in case of error (for development)
    return {
      customerList: [
        {
          customerId: "user1",
          customerName: "이름1",
          idToken: "token001",
          vehicleNo: "12-4234",
          registrationDate: "2024-05-23T16:30:00",
        },
      ],
      currentPage: 0,
      totalPages: 1,
      totalElements: 1,
    };
  }
}

/**
 * Updates customer information
 */
export async function updateCustomer(
  customerId: string,
  data: CustomerUpdateData
): Promise<CustomerUpdateResponse> {
  try {
    console.log(`Updating customer ${customerId} with data:`, data);

    // No formatting for phone number, just use as is
    const formattedData = {
      ...data,
    };

    const url = `${API_BASE_URL}/managing/customer/${customerId}`;

    console.log(`API Request URL: ${url}`);
    console.log("Sending data:", formattedData);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      // Parse error response as JSON if possible
      let errorMessage = "";
      try {
        const errorJson = await response.json();
        errorMessage = JSON.stringify(errorJson);
      } catch (e) {
        // If not JSON, get as text
        errorMessage = await response.text();
      }
      throw new Error(
        `API request failed: ${response.status}, ${errorMessage}`
      );
    }

    const responseData = await response.json();
    console.log("Customer update response:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error; // Re-throw the error to be handled by the component
  }
}
