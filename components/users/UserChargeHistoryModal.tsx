"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal, ModalContent } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/utils/date-utils";
import { formatNumber } from "@/lib/utils/number-utils";
import {
  fetchCustomerChargedLogs,
  fetchCustomerChargedLogsByDateRange,
  type CustomerChargedLog,
} from "@/services/userApi";
import { loadingStyles, errorStyles } from "@/lib/utils/style-utils";

interface UserChargeHistoryModalProps {
  customerId: string;
  customerName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function UserChargeHistoryModal({
  customerId,
  customerName,
  isOpen,
  onClose,
}: UserChargeHistoryModalProps) {
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  });
  const [filterType, setFilterType] = useState<"charge" | "payment">("charge");
  const [chargedLogs, setChargedLogs] = useState<CustomerChargedLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [itemsPerPage] = useState<number>(10);

  // Load charged logs when modal opens
  useEffect(() => {
    if (isOpen && customerId) {
      loadChargedLogs();
    }
  }, [isOpen, customerId, currentPage]);

  // Load charged logs
  const loadChargedLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchCustomerChargedLogs(
        customerId,
        currentPage,
        itemsPerPage
      );

      if (response && response.customerChargedLogList) {
        setChargedLogs(response.customerChargedLogList);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        throw new Error("Failed to fetch charged logs");
      }
    } catch (err) {
      console.error("Error loading charged logs:", err);
      setError(
        `데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Search by date range
  const searchByDateRange = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentPage(0); // Reset to first page

      const response = await fetchCustomerChargedLogsByDateRange(
        customerId,
        startDate,
        endDate,
        0,
        itemsPerPage
      );

      if (response && response.customerChargedLogList) {
        setChargedLogs(response.customerChargedLogList);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        throw new Error("Failed to fetch charged logs");
      }
    } catch (err) {
      console.error("Error searching charged logs by date range:", err);
      setError(
        `데이터를 불러오는 중 오류가 발생했습니다: ${(err as Error).message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page - 1); // API uses 0-based indexing
  };

  // Set date range to today
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
    // After setting the dates, automatically search with the new date range
    setTimeout(() => searchByDateRange(), 0);
  };

  // Set date range to last week
  const setLastWeek = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    // After setting the dates, automatically search with the new date range
    setTimeout(() => searchByDateRange(), 0);
  };

  // Set date range to last month
  const setLastMonth = () => {
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
    // After setting the dates, automatically search with the new date range
    setTimeout(() => searchByDateRange(), 0);
  };

  // Calculate totals
  const totalMeterValue = chargedLogs.reduce(
    (sum, log) => sum + log.totalMeterValue,
    0
  );
  const totalPrice = chargedLogs.reduce((sum, log) => sum + log.totalPrice, 0);

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[900px] max-h-[90vh] overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-2">사용자 아이디</h3>
              <p className="text-xl">{customerId}</p>
            </div>

            {/* Date Range Selection */}
            <div>
              <h3 className="text-lg font-bold mb-2">조회기간</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
                  />
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>

                <span className="mx-2">-</span>

                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 pr-8 text-sm"
                  />
                  <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>

                <Button className="h-7 px-3" onClick={searchByDateRange}>
                  적용
                </Button>

                <div className="flex gap-1 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-3"
                    onClick={setToday}
                  >
                    당일
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-3"
                    onClick={setLastWeek}
                  >
                    1주일
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-3"
                    onClick={setLastMonth}
                  >
                    1개월
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-2">조회순서</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filterType === "charge"}
                  onChange={() => setFilterType("charge")}
                  className="h-4 w-4"
                />
                <span>최근순</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={filterType === "payment"}
                  onChange={() => setFilterType("payment")}
                  className="h-4 w-4"
                />
                <span>시간순</span>
              </label>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <Button onClick={searchByDateRange} className="px-6">
              조회
            </Button>
          </div>

          {/* Charged Logs Table */}
          {isLoading ? (
            <div className={loadingStyles.container}>
              <div className={loadingStyles.spinner}></div>
            </div>
          ) : error ? (
            <div className={errorStyles.container}>{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800 text-zinc-400 border-t border-b border-zinc-700">
                  <tr>
                    <th className="py-2 px-3 text-left font-normal">
                      충전 시작 시간
                    </th>
                    <th className="py-2 px-3 text-left font-normal">
                      충전 완료 시간
                    </th>
                    <th className="py-2 px-3 text-left font-normal">
                      차량정보
                    </th>
                    <th className="py-2 px-3 text-left font-normal">
                      승인번호
                    </th>
                    <th className="py-2 px-3 text-left font-normal">충전량</th>
                    <th className="py-2 px-3 text-left font-normal">가격</th>
                  </tr>
                </thead>
                <tbody>
                  {chargedLogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 text-center text-zinc-400"
                      >
                        충전 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    chargedLogs.map((log, index) => (
                      <tr
                        key={index}
                        className="border-b border-zinc-700 hover:bg-zinc-800"
                      >
                        <td className="py-2 px-3">
                          {formatDate(log.startedTime)}
                        </td>
                        <td className="py-2 px-3">
                          {formatDate(log.endedTime)}
                        </td>
                        <td className="py-2 px-3">{log.vehicleNo}</td>
                        <td className="py-2 px-3">{log.transactionId}</td>
                        <td className="py-2 px-3">
                          {formatNumber(log.totalMeterValue)} (KWh)
                        </td>
                        <td className="py-2 px-3">
                          {formatNumber(log.totalPrice)} (KRW)
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot className="bg-zinc-800 border-t border-zinc-700">
                  <tr>
                    <td
                      colSpan={4}
                      className="py-2 px-3 text-right font-medium"
                    >
                      총 충전량 합계
                    </td>
                    <td className="py-2 px-3 font-medium">
                      {formatNumber(totalMeterValue)} (KWh)
                    </td>
                    <td className="py-2 px-3 font-medium">
                      {formatNumber(totalPrice)} (KRW)
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage + 1} // UI uses 1-based indexing
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
