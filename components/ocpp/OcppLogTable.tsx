"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { OcppLogDetailModal } from "./OcppLogDetailModal";
import type { OcppMessage } from "@/services/ocppLogApi";
import { formatTimestamp } from "@/lib/utils/date-utils";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OcppLogTableProps {
  logs: OcppMessage[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function OcppLogTable({
  logs,
  pagination,
  onPageChange,
}: OcppLogTableProps) {
  const [selectedLog, setSelectedLog] = useState<OcppMessage | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const sortedLogs = [...logs].sort((a, b) => {
    if (sortField === "timestamp") {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "messageType") {
      return sortDirection === "asc"
        ? a.messageType.localeCompare(b.messageType)
        : b.messageType.localeCompare(a.messageType);
    }

    if (sortField === "direction") {
      return sortDirection === "asc"
        ? a.direction.localeCompare(b.direction)
        : b.direction.localeCompare(a.direction);
    }

    if (sortField === "stationId") {
      return sortDirection === "asc"
        ? (a.stationId || "").localeCompare(b.stationId || "")
        : (b.stationId || "").localeCompare(a.stationId || "");
    }

    if (sortField === "chargerId") {
      return sortDirection === "asc"
        ? (a.chargerId || "").localeCompare(b.chargerId || "")
        : (b.chargerId || "").localeCompare(a.chargerId || "");
    }

    return 0;
  });

  const handleViewDetails = (log: OcppMessage) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const getDirectionBadge = (direction: string) => {
    if (direction === "incoming") {
      return (
        <Badge
          variant="outline"
          className="bg-blue-900/20 text-blue-300 border-blue-800"
        >
          수신
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-amber-900/20 text-amber-300 border-amber-800"
        >
          송신
        </Badge>
      );
    }
  };

  return (
    <div>
      <div className="rounded-md border border-zinc-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-800">
            <TableRow>
              <TableHead
                className="w-40 cursor-pointer hover:bg-zinc-700"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center">
                  시간 {getSortIcon("timestamp")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-zinc-700"
                onClick={() => handleSort("direction")}
              >
                <div className="flex items-center">
                  방향 {getSortIcon("direction")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-zinc-700"
                onClick={() => handleSort("messageType")}
              >
                <div className="flex items-center">
                  메시지 타입 {getSortIcon("messageType")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-zinc-700"
                onClick={() => handleSort("stationId")}
              >
                <div className="flex items-center">
                  충전소 {getSortIcon("stationId")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-zinc-700"
                onClick={() => handleSort("chargerId")}
              >
                <div className="flex items-center">
                  충전기 {getSortIcon("chargerId")}
                </div>
              </TableHead>
              <TableHead>내용</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  로그 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              sortedLogs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-zinc-800"
                  onClick={() => handleViewDetails(log)}
                >
                  <TableCell className="font-mono text-xs">
                    {formatTimestamp(log.timestamp)}
                  </TableCell>
                  <TableCell>{getDirectionBadge(log.direction)}</TableCell>
                  <TableCell>{log.messageType}</TableCell>
                  <TableCell>{log.stationId || "-"}</TableCell>
                  <TableCell>{log.chargerId || "-"}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.summary}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-zinc-400">
          총 {pagination.totalElements}개 항목 중{" "}
          {pagination.page * pagination.size + 1}-
          {Math.min(
            (pagination.page + 1) * pagination.size,
            pagination.totalElements
          )}
          개 표시
        </div>

        <Pagination
          currentPage={pagination.page + 1}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {selectedLog && (
        <OcppLogDetailModal
          log={selectedLog}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}
