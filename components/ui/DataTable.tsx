interface Column {
  header: string
  accessor: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, string>[]
}

export function DataTable({ columns, data }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-400 border-b border-zinc-700">
            {columns.map((column) => (
              <th key={column.accessor} className="text-left pb-2 font-normal">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-zinc-700">
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.accessor}`} className="py-2 text-xs">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
