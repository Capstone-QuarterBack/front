import type React from "react"
import { componentStyles } from "@/lib/utils/style-utils"
import { cn } from "@/lib/utils"

export interface Column {
  header: string
  accessor: string
  width?: string
  className?: string
  headerClassName?: string
  cellRenderer?: (value: any, row: Record<string, any>) => React.ReactNode
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, any>[]
  className?: string
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
  emptyMessage?: string
  isLoading?: boolean
}

export function DataTable({
  columns,
  data,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  emptyMessage = "데이터가 없습니다.",
  isLoading = false,
}: DataTableProps) {
  return (
    <div className={cn("w-full h-full overflow-auto", className)}>
      <table className="w-full text-sm">
        <thead className={cn(componentStyles.tableHeader, headerClassName)}>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor}
                className={cn("text-left pb-2 pt-1 font-normal px-2 sticky top-0 bg-zinc-800", column.headerClassName)}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                로딩 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={cn("border-b border-zinc-700", rowClassName)}>
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.accessor}`}
                    className={cn(componentStyles.tableCell, column.className, cellClassName)}
                  >
                    {column.cellRenderer ? column.cellRenderer(row[column.accessor], row) : row[column.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
