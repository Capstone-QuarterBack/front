"use client"

import type React from "react"

import { NavItem } from "@/components/layout/NavItem"
import { useState, useEffect } from "react"
import { componentStyles } from "@/lib/utils/style-utils"
import { COMPONENT_SIZES } from "@/lib/constants/theme"
import { cn } from "@/lib/utils"

// 사이드바 메뉴 아이템 타입 정의
export interface SidebarMenuItem {
  id: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

interface SidebarProps {
  menuItems?: SidebarMenuItem[]
  className?: string
  defaultCollapsed?: boolean
}

export function Sidebar({ menuItems = [], className = "", defaultCollapsed = false }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  // 기본 메뉴 아이템 정의
  const defaultMenuItems: SidebarMenuItem[] = [
    { id: "dashboard", icon: <div className="w-4 h-4 bg-zinc-400" />, label: "대시보드", isActive: true },
    { id: "overview", icon: <div className="w-4 h-4 bg-zinc-600" />, label: "Overview" },
    { id: "history", icon: <div className="w-4 h-4 bg-zinc-600" />, label: "동계 및 이력관리" },
    { id: "transactions", icon: <div className="w-4 h-4 bg-zinc-600" />, label: "거래내역" },
    { id: "users", icon: <div className="w-4 h-4 bg-zinc-600" />, label: "사용자 관리" },
    { id: "settings", icon: <div className="w-4 h-4 bg-zinc-600" />, label: "설정" },
  ]

  // 메뉴 아이템 결정 (props로 전달된 것이 있으면 사용, 없으면 기본값 사용)
  const items = menuItems.length > 0 ? menuItems : defaultMenuItems

  // 화면 크기에 따라 사이드바 상태 자동 조정
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setCollapsed(true)
      } else if (defaultCollapsed === false) {
        setCollapsed(false)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [defaultCollapsed])

  return (
    <div
      className={cn(
        componentStyles.sidebar,
        collapsed ? `w-[${COMPONENT_SIZES.sidebar.collapsed}]` : `w-[${COMPONENT_SIZES.sidebar.expanded}]`,
        className,
      )}
    >
      <div className={componentStyles.sidebarLogo}>
        <h1 className="text-xl font-bold">{collapsed ? "L" : "LOGO"}</h1>
      </div>
      <nav className="flex-1">
        <div className={cn(componentStyles.sidebarMenu, collapsed ? "text-center" : "")}>
          {collapsed ? "메뉴" : "대시보드"}
        </div>

        {items.map((item) => (
          <NavItem key={item.id} icon={item.icon} label={item.label} active={item.isActive} collapsed={collapsed} />
        ))}
      </nav>
      <button
        className={componentStyles.button}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "사이드바 확장" : "사이드바 축소"}
      >
        {collapsed ? ">" : "<"}
      </button>
    </div>
  )
}
