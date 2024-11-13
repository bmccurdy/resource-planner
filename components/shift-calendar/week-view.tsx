import { format, addDays } from "date-fns"
import { DAYS_OF_WEEK } from "@/constants/shift-calendar"
import type { ShiftWeek } from "@/types/shift-calendar"
import { useRef, useState } from "react"

interface WeekViewProps {
  week: ShiftWeek
  weekIndex: number
  currentWeek: Date
  onToggleShift: (weekIndex: number, dayIndex: number) => void
  onShiftPattern?: (weekIndex: number, offset: number) => void
}

export function WeekView({ week, weekIndex, currentWeek, onToggleShift, onShiftPattern }: WeekViewProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return

    const diff = startX - e.clientX
    const dayWidth = scrollRef.current?.clientWidth ? scrollRef.current.clientWidth / 7 : 0
    
    // Only trigger pattern shift if dragged more than half a day width
    if (Math.abs(diff) > dayWidth / 2) {
      const direction = diff > 0 ? -1 : 1
      onShiftPattern?.(weekIndex, direction)
      setStartX(e.clientX)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <div className="space-y-3 bg-white rounded-md border p-3">
      <div className="font-medium text-center text-xs text-gray-900 bg-gray-50 p-1 rounded-md border border-gray-100">
        {format(addDays(currentWeek, weekIndex * 7), "MMM d")} - {format(addDays(currentWeek, (weekIndex + 1) * 7 - 1), "MMM d")}
      </div>
      <div 
        ref={scrollRef}
        className="grid grid-cols-7 gap-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={`${day}-${weekIndex}-${index}`} className="space-y-2">
            <div className="font-medium text-xs text-center text-gray-600">{day}</div>
            <button
              onClick={() => onToggleShift(weekIndex, index)}
              className={`p-1 text-sm w-full rounded-md transition-all duration-200 ${
                week.shifts[index] 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100" 
                  : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
              }`}
            >
              {week.shifts[index] ? "On" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 