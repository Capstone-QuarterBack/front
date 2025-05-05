interface Transaction {
  time: string
  status: string
}

interface TradingPanelProps {
  data: {
    title: string
    amount: string
    change: string
    isPositive: boolean
    transactions: Transaction[]
  }
}

export function TradingPanel({ data }: TradingPanelProps) {
  const { title, amount, change, isPositive, transactions } = data
  const borderColor = isPositive ? "border-green-500" : "border-red-500"
  const textColor = isPositive ? "text-green-500" : "text-red-500"

  return (
    <div className={`border-l-4 ${borderColor} bg-zinc-700/30 p-3`}>
      <div className="text-sm mb-1">{title}</div>
      <div className={`${textColor} text-xl font-bold mb-1`}>{amount}</div>
      <div className={`flex items-center text-xs ${textColor}`}>
        <span className="mr-1">{isPositive ? "▲" : "▼"}</span> {change.split(" ")[1]}
      </div>
      <div className="mt-4 space-y-2">
        {transactions.map((transaction, i) => (
          <div key={i} className="flex justify-between text-xs">
            <div>{transaction.time}</div>
            <div>{transaction.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
