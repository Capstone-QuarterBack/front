"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { NavItem } from "@/components/layout/NavItem"
import { useState, useEffect } from "react"
import { componentStyles } from "@/lib/utils/style-utils"
import { COMPONENT_SIZES } from "@/lib/constants/theme"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BarChart2, History, CreditCard, Users, Settings } from "lucide-react"

// 사이드바 메뉴 아이템 타입 정의
export interface SidebarMenuItem {
  id: string
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
}

interface SidebarProps {
  menuItems?: SidebarMenuItem[]
  className?: string
  defaultCollapsed?: boolean
  activeItem?: string
}

export function Sidebar({ menuItems = [], className = "", defaultCollapsed = false, activeItem }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const pathname = usePathname()

  // 기본 메뉴 아이템 정의
  const defaultMenuItems: SidebarMenuItem[] = [
    {
      id: "dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "대시보드",
      href: "/",
      isActive: activeItem === "dashboard" || pathname === "/",
    },
    {
      id: "overview",
      icon: <BarChart2 className="w-4 h-4" />,
      label: "Overview",
      href: "/overview",
      isActive: activeItem === "overview" || pathname === "/overview",
    },
    {
      id: "history",
      icon: <History className="w-4 h-4" />,
      label: "동계 및 이력관리",
      href: "/history",
      isActive: activeItem === "history" || pathname === "/history",
    },
    {
      id: "transactions",
      icon: <CreditCard className="w-4 h-4" />,
      label: "거래내역",
      href: "/transactions",
      isActive: activeItem === "transactions" || pathname === "/transactions",
    },
    {
      id: "users",
      icon: <Users className="w-4 h-4" />,
      label: "사용자 관리",
      href: "/users",
      isActive: activeItem === "users" || pathname === "/users",
    },
    {
      id: "settings",
      icon: <Settings className="w-4 h-4" />,
      label: "설정",
      href: "/settings",
      isActive: activeItem === "settings" || pathname === "/settings",
    },
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
          <Link key={item.id} href={item.href} className="block">
            <NavItem icon={item.icon} label={item.label} active={item.isActive} collapsed={collapsed} />
          </Link>
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
