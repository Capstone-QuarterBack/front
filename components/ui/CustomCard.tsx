import type React from "react"
import { cn } from "@/lib/utils"
import { componentStyles } from "@/lib/utils/style-utils"

interface CustomCardProps {
  title?: string
  children: React.ReactNode
  className?: string
  headerClassName?: string
  titleClassName?: string
  headerRight?: React.ReactNode
}

export function CustomCard({
  title,
  children,
  className = "",
  headerClassName = "",
  titleClassName = "",
  headerRight,
}: CustomCardProps) {
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
