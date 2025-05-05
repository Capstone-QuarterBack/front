export function TransactionSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-zinc-800 rounded-lg p-4">
      <div className="flex flex-col items-center p-3">
        <div className="text-sm text-zinc-400 mb-2">총 수익</div>
        <div className="text-xl font-bold">107,312.21 (KRW)</div>
      </div>
      <div className="flex flex-col items-center p-3 border-l border-r border-zinc-700">
        <div className="text-sm text-zinc-400 mb-2">총 ESS충전량</div>
        <div className="text-xl font-bold">150,201 (KWh)</div>
      </div>
      <div className="flex flex-col items-center p-3">
        <div className="text-sm text-zinc-400 mb-2">총 ESS방전량</div>
        <div className="text-xl font-bold">102,501 (KWh)</div>
      </div>
    </div>
  )
}
