"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BookProps {
  title: string
  isSelected: boolean
  onClick: () => void
  color?: string
}

export function Book({ title, isSelected, onClick, color = "bg-amber-700" }: BookProps) {
  return (
    <motion.div
      className={cn(
        "relative cursor-pointer transition-all duration-300 group",
        isSelected ? "scale-110 z-10" : "hover:scale-105",
      )}
      whileHover={{ y: -5 }}
      whileTap={{ y: 0 }}
      onClick={onClick}
    >
      {/* Book spine */}
      <div
        className={cn(
          "w-24 h-[140px] rounded-r-md flex items-center justify-center shadow-lg relative",
          color,
          isSelected ? "border-2 border-white" : "border border-amber-900",
        )}
      >
        {/* Book title (vertical text) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform -rotate-90 whitespace-nowrap font-bold text-white text-lg px-2 py-1">
            {title.toUpperCase()}
          </div>
        </div>

        {/* Book pages edge */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-[#f5f0e0] rounded-r-sm"></div>
      </div>

      {/* Book shadow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-black/20 rounded-full blur-sm"></div>

      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-amber-700"></div>
        </motion.div>
      )}
    </motion.div>
  )
}
