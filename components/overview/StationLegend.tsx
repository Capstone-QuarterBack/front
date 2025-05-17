export function StationLegend() {
  return (
    <div className="flex items-center gap-4 bg-zinc-800/80 px-3 py-1 rounded-md">
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-xs">사용가능</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <span className="text-xs">사용불가</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <span className="text-xs">수리중</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-black"></div>
        <span className="text-xs">사용중지</span>
      </div>
    </div>
  )
}
