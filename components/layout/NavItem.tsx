import type React from "react"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  collapsed?: boolean
}

export function NavItem({ icon, label, active = false, collapsed = false }: NavItemProps) {
  return (
    <div
      className={`flex items-center px-3 py-2 text-sm ${
        active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
      }`}
    >
      <div className="mr-3">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </div>
  )
}
