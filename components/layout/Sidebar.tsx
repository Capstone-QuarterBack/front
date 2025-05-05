import { NavItem } from "@/components/layout/NavItem"

export function Sidebar() {
  return (
    <div className="w-[200px] border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-center">
        <h1 className="text-xl font-bold">LOGO</h1>
      </div>
      <nav className="flex-1">
        <div className="px-3 py-2 text-xs font-medium text-zinc-500">대시보드</div>
        <NavItem active icon={<div className="w-4 h-4 bg-zinc-400" />} label="대시보드" />
        <NavItem icon={<div className="w-4 h-4 bg-zinc-600" />} label="Overview" />
        <NavItem icon={<div className="w-4 h-4 bg-zinc-600" />} label="동계 및 이력관리" />
        <NavItem icon={<div className="w-4 h-4 bg-zinc-600" />} label="거래내역" />
        <NavItem icon={<div className="w-4 h-4 bg-zinc-600" />} label="사용자 관리" />
        <NavItem icon={<div className="w-4 h-4 bg-zinc-600" />} label="설정" />
      </nav>
    </div>
  )
}
