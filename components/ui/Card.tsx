import type React from "react"

interface CardProps {
  title: string
  children: React.ReactNode
  className?: string
  headerRight?: React.ReactNode
}

export function Card({ title, children, className = "", headerRight }: CardProps) {
  return (
    <div className={`bg-zinc-800 rounded-lg p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium">{title}</h2>
        {headerRight && headerRight}
      </div>
      {children}
    </div>
  )
}
