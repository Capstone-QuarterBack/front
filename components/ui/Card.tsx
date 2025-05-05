import type React from "react"
import { componentStyles } from "@/lib/utils/style-utils"
import { cn } from "@/lib/utils"

interface CardProps {
  title?: string // title을 선택적으로 변경
  children: React.ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
  headerRight?: React.ReactNode
}

export function Card({
  title,
  children,
  className = "",
  headerClassName = "",
  titleClassName = "",
  headerRight,
}: CardProps) {
  return (
    <div className={cn(componentStyles.card, className)}>
      {/* title이 있을 때만 헤더 렌더링 */}
      {title && (
        <div className={cn(componentStyles.cardHeader, headerClassName)}>
          <h2 className={cn(componentStyles.cardTitle, titleClassName)}>{title}</h2>
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
